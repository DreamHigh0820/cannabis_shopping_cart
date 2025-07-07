import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Product, BlogPost } from "@/lib/models/Product"

export async function POST() {
  try {
    const db = await getDatabase()

    // Sample products data
    const products: Product[] = [
      // Flowers
      {
        id: 1,
        name: "Purple Haze",
        category: "flowers",
        price: 45,
        image: "/images/purple-haze.png",
        rating: 4.8,
        description: "Classic sativa strain with euphoric effects",
        thc: "18-22%",
        cbd: "<1%",
        strain: "Sativa",
        featured: true,
        inStock: true,
      },
      {
        id: 2,
        name: "OG Kush",
        category: "flowers",
        price: 50,
        image: "/images/og-kush.png",
        rating: 4.9,
        description: "Legendary hybrid with earthy pine aroma",
        thc: "20-25%",
        cbd: "<1%",
        strain: "Hybrid",
        featured: false,
        inStock: true,
      },
      {
        id: 3,
        name: "Granddaddy Purple",
        category: "flowers",
        price: 48,
        image: "/images/granddaddy-purple.png",
        rating: 4.7,
        description: "Heavy indica perfect for relaxation",
        thc: "17-23%",
        cbd: "<1%",
        strain: "Indica",
        featured: false,
        inStock: true,
      },
      // Vapes
      {
        id: 4,
        name: "Blue Dream Cart",
        category: "vapes",
        price: 35,
        image: "/images/blue-dream-cart.png",
        rating: 4.6,
        description: "Smooth hybrid vape cartridge",
        thc: "85-90%",
        cbd: "<1%",
        featured: true,
        inStock: true,
      },
      {
        id: 5,
        name: "Sour Diesel Disposable",
        category: "vapes",
        price: 30,
        image: "/images/sour-diesel-disposable.png",
        rating: 4.8,
        description: "Energizing sativa disposable pen",
        thc: "80-85%",
        cbd: "<1%",
        featured: false,
        inStock: true,
      },
      {
        id: 6,
        name: "Gelato Live Resin Cart",
        category: "vapes",
        price: 45,
        image: "/images/gelato-live-resin.png",
        rating: 4.9,
        description: "Premium live resin cartridge",
        thc: "90-95%",
        cbd: "<1%",
        featured: false,
        inStock: true,
      },
      // Edibles
      {
        id: 7,
        name: "Gummy Bears 10mg",
        category: "edibles",
        price: 25,
        image: "/images/gummy-bears.png",
        rating: 4.7,
        description: "Assorted fruit flavored gummies",
        thc: "10mg each",
        cbd: "<1mg",
        featured: true,
        inStock: true,
      },
      {
        id: 8,
        name: "Chocolate Bar 100mg",
        category: "edibles",
        price: 20,
        image: "/images/chocolate-bar.png",
        rating: 4.8,
        description: "Rich dark chocolate infused bar",
        thc: "100mg total",
        cbd: "<5mg",
        featured: false,
        inStock: true,
      },
      {
        id: 9,
        name: "Cookies 25mg",
        category: "edibles",
        price: 15,
        image: "/images/cookies.png",
        rating: 4.6,
        description: "Homemade chocolate chip cookies",
        thc: "25mg each",
        cbd: "<2mg",
        featured: false,
        inStock: true,
      },
      // Extracts
      {
        id: 10,
        name: "Live Rosin",
        category: "extracts",
        price: 60,
        image: "/images/live-rosin.png",
        rating: 4.9,
        description: "Solventless premium extract",
        thc: "70-80%",
        cbd: "<5%",
        featured: true,
        inStock: true,
      },
      {
        id: 11,
        name: "Shatter",
        category: "extracts",
        price: 40,
        image: "/images/shatter.png",
        rating: 4.7,
        description: "Glass-like concentrated extract",
        thc: "80-90%",
        cbd: "<1%",
        featured: false,
        inStock: true,
      },
      {
        id: 12,
        name: "Hash",
        category: "extracts",
        price: 35,
        image: "/images/hash.png",
        rating: 4.8,
        description: "Traditional bubble hash",
        thc: "40-60%",
        cbd: "<5%",
        featured: false,
        inStock: true,
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
      {
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
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
        id: 10,
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
      {
        id: 11,
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
        id: 12,
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
        id: 13,
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
        id: 14,
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
        id: 15,
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
      {
        id: 16,
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
        id: 17,
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
        id: 18,
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
        id: 19,
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
        id: 20,
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
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
