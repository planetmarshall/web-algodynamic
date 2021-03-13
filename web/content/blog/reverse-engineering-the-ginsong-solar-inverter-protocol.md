Title: Reverse Engineering the Solis/Ginlong Inverter Protocol
Date: 2021-03-12
Category: Python

One of my major tasks this year is to do a thorough renovation of my home's energy efficiency - the
first completed project is an installation of Solar Photovoltaic Panels on the roof. The Inverter
reports the panels' power output to a central server, but I wanted to get hold of this data myself
in order to display a chart as part of my OpenHAB panel.

## Previous work

For previous work along these lines, which I've referred to when creating this solution, see

* graham0's [ginlong-wifi](https://github.com/graham0/ginlong-wifi) 
* Darren Poulson's [ginlong-mqtt](https://github.com/dpoulson/ginlong-mqtt)

Unfortunately the protocol has been updated since these solutions were created and
neither of them worked for me.

## Determining the protocol

### Redirect the inverter output to a local system

[Ginlong Support](https://usservice.ginlong.com/support/solutions/articles/36000241195-monitoring-accessory-configured-but-still-won-t-link-)

    :::python
    async def handle_inverter(reader, writer):
        data = await reader.read(256)
        print(data)
        
    async def main():
        server = await asyncio.start_server(
            handle_inverter,
            '192.168.10.9',
             9042)
             
    asyncio.run(main())

        
The initial data from the inverter is a 99-byte message, some of which is immediately identifiable
as the firmware version and the local IP of the inverter.

    b'...\x00\x00\x05<x...MW_08_512_0501_1.82...\x00\x00...192.168.10.8...\xa8\x15'
    
However, we know from previous work and from the data available on the ginlong server, that the
invert uploads information on energy output and temperature that is clearly not part of this message.
It seems likely that this is a "heartbeat", and is waiting for some kind of response before sending
the actual data we're interested in.

### The "machine in the middle" attack

This isn't quite as nefarious than it sounds, but simply involves intercepting
transmissions to and from the inverter so that we can find out what the server response to the heartbeat
message looks like. Hopefully it's going to be something simple that we can mimic, and get the inverter
to send us the data instead without involving ginlong's server at all

    :::python
    async def read_and_log_response(reader):
        data = await reader.read(256)
        print(data)
        return data
        
    async def log_and_forward_response(reader, writer):
        data = await read_and_log_response(reader)
        writer.write(data)
        await writer.drain()
        writer.close()
        
    async def handle_inverter_message(inverter_reader, inverter_writer):
        server_reader, server_writer = await asyncio.open_connection('47.88.8.200', 10000)
        await log_and_forward_response(inverter_reader, server_writer)
        await log_and_forward_response(server_reader, inverter_writer)

    async def main():
        server = await asyncio.start_server(
            handle_inverter_message,
            '192.168.10.9',
             9042)
             
    asyncio.run(main())

As hoped, as soon as we forward on the heartbeat to ther server, we get a response. In turn, the
inverter starts sending back a 246 byte message that looks much more interesting.

### The server response

In response to the heartbeat, the server sends back a 23 byte message that looks like this - 

    b'\xa5\n\x00\x10\x11K\x01\xc2\xe8\xd7\xf0\x02\x01\x8f~K`\x00\x00\x00\x00\xa3\x15'
   
Unless the developers have used some sort of standard serialization format like 
[MessagePack](https://msgpack.org/index.html) 
(they haven't - I tried), then trying to figure out the content of the response is a 
laborious process. Fortunately the message is quite short, and over the course of the day
only a few parts of the message change. One portion in particular stands out.

If we assume that the message contains 32bit integers 
(in [little-endian](https://en.wikipedia.org/wiki/Endianness) format), bytes 13-17 represent the
number `1615560335`. Work with binary data enough, and some things start to look familiar. This
just happens to be the number of seconds since Thursday 1 January, 1970 - better known as 
[Unix time](https://en.wikipedia.org/wiki/Unix_time).

## Decoding the inverter data packet

We could sift through the 246 byte inverter data packet in a similar fashion looking for interesting values, 
however that would be a tedious process and there's a much better way. Since we've forwarded the data
on to the Ginlong server, we can log into the portal and export the data collected for the day. That gives
us an indication of what the packet should contain. We can then write a brute-force algorithm that compares
the expected data to various decoded values in the data packet and look for correlations.

