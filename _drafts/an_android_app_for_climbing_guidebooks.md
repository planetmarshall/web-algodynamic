---
title: "An Android App for Climbing Guidebooks"
---

Climbing guidebooks are generally heavy, and unweildy. Not such a problem at a roadside crag, more so on long Scottish multipitch and Winter routes with lengthy approaches. Some climbers opt to carry the book anyway, others opting for photocopies of just the area they need. Increasingly I've seen climbers using photos of guidebook pages on their mobile phones - convenient since this is an item they tend to carry anyway. The camera software built into most mobiles while do this just fine, but with a bit of programming expertise we can do better.

Here's a photograph taken from the SMC Cairngorms guide.

One thing we might want to do is display the page in a way that makes it easier to read. To do that, we first need to turn the image into text. We can use the Tesseract OCR software to do this, but it doesn't do so well on this image 'out of the box'

The first step is to reorient the page so that it is aligned with the sides of the image. There are a few ways of doing this, I have opted for a simple method based on calculating the image's histogram of oriented gradients.

Having reoriented the image, we run Tesseract again

I've used Python and the skimage package to prototype the image processing steps before packaging it into an application. 
