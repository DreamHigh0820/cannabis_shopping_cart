import { getDatabase } from "@/lib/mongodb"

const imageMapping = {
  "/images/purple-haze.png": "/images/purple-haze-new.jpg",
  "/images/og-kush.png": "/images/og-kush-new.jpg",
  "/images/blue-dream-cart.png": "/images/blue-dream-cart-new.jpg",
  "/images/gummy-bears.png": "/images/gummy-bears-new.jpg",
  "/images/live-rosin.png": "/images/live-rosin-new.jpg",
  // Add more mappings as needed
}

export async function updateAllImages() {
  try {
    const db = await getDatabase()

    // Update product images
    for (const [oldPath, newPath] of Object.entries(imageMapping)) {
      await db.collection("products").updateMany({ image: oldPath }, { $set: { image: newPath } })

      console.log(`Updated ${oldPath} to ${newPath}`)
    }

    // Update blog post images
    await db
      .collection("blog_posts")
      .updateMany({ image: "/images/blog-terpenes.png" }, { $set: { image: "/images/blog-terpenes-new.jpg" } })

    console.log("All images updated successfully!")
  } catch (error) {
    console.error("Error updating images:", error)
  }
}
