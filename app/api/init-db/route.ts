import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Product, BlogPost } from "@/lib/models/Product"

export async function POST() {
  try {
    const db = await getDatabase()

    // New sample products data matching the updated structure
    const products: Product[] = [
      // Flowers (QP)
      {
        id: 1,
        code: "FLPH01",
        name: "Purple Haze QP",
        category: "flowers",
        price: 525, // Price per QP
        quantity: 50,
        image: "/images/purple-haze-new.png",
        description:
          "A classic sativa strain known for its euphoric and creative effects. Each unit is a quarter pound (QP).",
        nose: "Sweet, earthy, with hints of berry and spice.",
        strain: "Sativa",
        cost: 350,
        featured: true,
      },
      {
        id: 2,
        code: "FLOK01",
        name: "OG Kush QP",
        category: "flowers",
        price: 550,
        quantity: 40,
        image: "/images/og-kush-new.png",
        description:
          "A legendary hybrid with a complex aroma of fuel, skunk, and spice. Perfect for a balanced mind and body high.",
        nose: "Earthy pine and sour lemon with woody undertones.",
        strain: "Hybrid",
        cost: 380,
        featured: false,
      },
      {
        id: 3,
        code: "FLGP01",
        name: "Granddaddy Purple QP",
        category: "flowers",
        price: 500,
        quantity: 60,
        image: "/images/granddaddy-purple.png",
        description:
          "A famous indica cross with deep purple blooms. Delivers a fusion of cerebral euphoria and physical relaxation.",
        nose: "Complex grape and berry aroma.",
        strain: "Indica",
        cost: 330,
        featured: false,
      },
      // Pound
      {
        id: 13,
        code: "LBBD01",
        name: "Blue Dream Pound",
        category: "pound",
        price: 1800, // Price per Pound (equivalent to 4 QPs)
        quantity: 10,
        image: "/images/blue-dream-cart-new.png", // Placeholder image
        description:
          "A full pound of the legendary Blue Dream. A sativa-dominant hybrid that balances full-body relaxation with gentle cerebral invigoration.",
        nose: "Sweet berry aroma reminiscent of its Blueberry parent.",
        strain: "Sativa Hybrid",
        cost: 1200,
        featured: true,
      },
      // Vapes
      {
        id: 4,
        code: "VABD01",
        name: "Blue Dream Cart",
        category: "vapes",
        price: 35,
        quantity: 100,
        image: "/images/blue-dream-cart-new.png",
        description: "A smooth and potent vape cartridge filled with high-quality Blue Dream distillate.",
        nose: "Sweet berry and herbal notes.",
        strain: "Sativa Hybrid",
        cost: 15,
        featured: true,
      },
      {
        id: 5,
        code: "VASD01",
        name: "Sour Diesel Disposable",
        category: "vapes",
        price: 30,
        quantity: 120,
        image: "/images/sour-diesel-disposable.png",
        description: "An energizing and fast-acting sativa disposable pen, perfect for daytime use.",
        nose: "Pungent, diesel-like aroma.",
        strain: "Sativa",
        cost: 12,
        featured: false,
      },
      // Edibles
      {
        id: 7,
        code: "EDGB01",
        name: "Gummy Bears 100mg",
        category: "edibles",
        price: 25,
        quantity: 200,
        image: "/images/gummy-bears-new.png",
        description: "A pack of delicious assorted fruit-flavored gummies, each containing 10mg of THC.",
        nose: "Fruity and sweet.",
        strain: "Hybrid",
        cost: 10,
        featured: true,
      },
      {
        id: 8,
        code: "EDCB01",
        name: "Chocolate Bar 100mg",
        category: "edibles",
        price: 20,
        quantity: 150,
        image: "/images/chocolate-bar.png",
        description: "A rich dark chocolate bar infused with 100mg of premium THC extract.",
        nose: "Rich cocoa.",
        strain: "Indica",
        cost: 8,
        featured: false,
      },
      // Extracts
      {
        id: 10,
        code: "EXLR01",
        name: "Live Rosin 1g",
        category: "extracts",
        price: 60,
        quantity: 80,
        image: "/images/live-rosin-new.png",
        description: "A solventless, premium extract known for its purity and full-spectrum flavor profile.",
        nose: "Pungent, floral, and true to the source plant.",
        strain: "Indica",
        cost: 35,
        featured: true,
      },
      {
        id: 11,
        code: "EXSH01",
        name: "Shatter 1g",
        category: "extracts",
        price: 40,
        quantity: 90,
        image: "/images/shatter.png",
        description: "A potent, glass-like concentrate with high THC levels, perfect for experienced users.",
        nose: "Varies by batch, typically piney or citrusy.",
        strain: "Hybrid",
        cost: 20,
        featured: false,
      },
    ]

    // Sample blog posts data
    const blogPosts: BlogPost[] = [
      {
        id: 1,
        title: "The Ultimate Guide to Cannabis Terpenes",
        excerpt:
          "Learn about the aromatic compounds that give cannabis its unique flavors and effects. Discover how terpenes work synergistically with cannabinoids.",
        content: `
          <h2>What Are Terpenes?</h2>
          <p>Cannabis terpenes are aromatic compounds found in many plants, including cannabis. They're responsible for the distinctive scents and flavors of different cannabis strains. More than just providing pleasant aromas, terpenes play a crucial role in the overall cannabis experience through what's known as the "entourage effect."</p>
          
          <h2>Common Cannabis Terpenes</h2>
          <h3>Myrcene</h3>
          <p>Found in mangoes, lemongrass, and hops, myrcene is the most common terpene in cannabis. It's known for its relaxing and sedating effects, often contributing to the "couch lock" feeling associated with certain indica strains.</p>
          
          <h3>Limonene</h3>
          <p>As the name suggests, limonene is found in citrus fruits and provides a bright, citrusky aroma. It's associated with mood elevation and stress relief, making it popular in sativa-dominant strains.</p>
          
          <h3>Pinene</h3>
          <p>This terpene smells like pine trees and is found in rosemary, basil, and of course, pine needles. Pinene is believed to promote alertness and memory retention, potentially counteracting some of THC's memory-impairing effects.</p>
          
          <h2>The Entourage Effect</h2>
          <p>The entourage effect is the theory that cannabis compounds work better together than in isolation. Terpenes are thought to modulate the effects of cannabinoids like THC and CBD, creating a more nuanced and therapeutic experience.</p>
          
          <h2>How to Use Terpene Knowledge</h2>
          <p>Understanding terpenes can help you choose strains that match your desired effects. If you're looking for relaxation, seek out strains high in myrcene. For energy and focus, look for limonene and pinene-rich varieties.</p>
          
          <p>Remember, everyone's body chemistry is different, so what works for one person may not work for another. The best approach is to start with small amounts and pay attention to how different terpene profiles affect you personally.</p>
        `,
        date: "2024-01-15",
        author: "Dr. Sarah Johnson",
        image: "/images/blog-terpenes.png",
        category: "Education",
        readTime: "8 min read",
        featured: true,
        published: true,
      },
      {
        id: 2,
        title: "Indica vs Sativa: Understanding the Difference",
        excerpt:
          "Explore the key differences between these two main cannabis categories and learn how they might affect your experience.",
        content: `
          <h2>The Classic Classification</h2>
          <p>Cannabis has traditionally been classified into two main categories: Indica and Sativa. This classification system, while somewhat outdated, still provides a useful framework for understanding different cannabis experiences.</p>
          
          <h2>Indica Characteristics</h2>
          <p>Indica strains are typically associated with:</p>
          <ul>
            <li>Relaxing and sedating effects</li>
            <li>Body-focused sensations</li>
            <li>Better for evening use</li>
            <li>May help with sleep and pain relief</li>
          </ul>
          
          <h2>Sativa Characteristics</h2>
          <p>Sativa strains are generally known for:</p>
          <ul>
            <li>Energizing and uplifting effects</li>
            <li>Head-focused sensations</li>
            <li>Better for daytime use</li>
            <li>May help with creativity and focus</li>
          </ul>
          
          <h2>The Reality: It's More Complex</h2>
          <p>Modern cannabis science shows that the effects of cannabis are more complex than just indica vs sativa. Factors like terpene profiles, cannabinoid ratios, and individual body chemistry play crucial roles in determining effects.</p>
        `,
        date: "2024-01-10",
        author: "Mike Chen",
        image: "/images/blog-indica-sativa.png",
        category: "Strains",
        readTime: "6 min read",
        featured: false,
        published: true,
      },
      {
        id: 3,
        title: "How to Choose the Right Edible Dosage",
        excerpt:
          "A beginner's guide to finding your perfect edible experience. Learn about onset times, duration, and safe dosing practices.",
        content: `
          <h2>Start Low and Go Slow</h2>
          <p>The golden rule of cannabis edibles is "start low and go slow." Unlike smoking or vaping, edibles can take 30 minutes to 2 hours to take effect, and the effects can last 4-8 hours.</p>
          
          <h2>Beginner Dosing Guidelines</h2>
          <ul>
            <li><strong>2.5-5mg THC:</strong> Micro-dose for beginners</li>
            <li><strong>5-10mg THC:</strong> Standard beginner dose</li>
            <li><strong>10-20mg THC:</strong> Experienced users</li>
            <li><strong>20mg+ THC:</strong> High tolerance users only</li>
          </ul>
          
          <h2>Factors That Affect Edible Effects</h2>
          <p>Several factors can influence how edibles affect you:</p>
          <ul>
            <li>Body weight and metabolism</li>
            <li>Whether you've eaten recently</li>
            <li>Cannabis tolerance</li>
            <li>Individual body chemistry</li>
          </ul>
          
          <h2>Safety Tips</h2>
          <p>Always wait at least 2 hours before taking more. Keep edibles away from children and pets. Store in original packaging with clear labeling.</p>
        `,
        date: "2024-01-05",
        author: "Lisa Martinez",
        image: "/images/blog-edibles.png",
        category: "Edibles",
        readTime: "7 min read",
        featured: true,
        published: true,
      },
      {
        id: 4,
        title: "The Science Behind Live Rosin",
        excerpt:
          "Discover what makes live rosin the premium choice for concentrate enthusiasts. Learn about the extraction process and quality indicators.",
        content: `
          <h2>What is Live Rosin?</h2>
          <p>Live rosin is a premium cannabis concentrate made using a solventless extraction process. Unlike other concentrates that use chemical solvents, live rosin is created using only heat, pressure, and ice water.</p>
          
          <h2>The Extraction Process</h2>
          <p>The process begins with fresh-frozen cannabis plants that are immediately frozen after harvest to preserve terpenes and cannabinoids. The material is then processed using ice water extraction to create bubble hash, which is then pressed using heat and pressure to create the final rosin product.</p>
          
          <h2>Why Live Rosin is Premium</h2>
          <p>Live rosin preserves the full spectrum of cannabinoids and terpenes from the original plant, resulting in a more flavorful and potent product. The solventless extraction method ensures no residual chemicals remain in the final product.</p>
        `,
        date: "2023-12-28",
        author: "James Wilson",
        image: "/images/live-rosin.png",
        category: "Concentrates",
        readTime: "9 min read",
        featured: false,
        published: true,
      },
      {
        id: 5,
        title: "Cannabis and Sleep: What You Need to Know",
        excerpt:
          "Explore how different cannabis strains and products might affect your sleep cycle and overall rest quality.",
        content: `
          <h2>Cannabis and Sleep</h2>
          <p>Many people turn to cannabis to help with sleep issues, but understanding how different strains and products affect sleep is important for getting the best results.</p>
          
          <h2>Best Strains for Sleep</h2>
          <p>Indica-dominant strains with high levels of myrcene are typically best for sleep. Look for strains like Granddaddy Purple, Northern Lights, or Purple Kush.</p>
          
          <h2>Timing and Dosage</h2>
          <p>For flower, consume 1-2 hours before bedtime. For edibles, allow 2-3 hours for onset. Start with low doses and adjust as needed.</p>
        `,
        date: "2023-12-20",
        author: "Dr. Patricia Lee",
        image: "/images/blog-terpenes.png",
        category: "Wellness",
        readTime: "10 min read",
        featured: true,
        published: true,
      },
    ]

    // Clear existing data and insert new data
    await db.collection("products").deleteMany({})
    await db.collection("blog_posts").deleteMany({})

    await db.collection("products").insertMany(products)
    await db.collection("blog_posts").insertMany(blogPosts)

    return NextResponse.json({ message: "Database initialized successfully" })
  } catch (error) {
    console.error("Error initializing database:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to initialize database: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
