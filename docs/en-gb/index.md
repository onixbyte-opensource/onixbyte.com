---
pageType: home

hero:
  name: OnixByte
  tagline: We design, build and run the systems your business depends on.
  actions:
    - theme: brand
      text: Explore Services
      link: /services/
    - theme: alt
      text: View Products
      link: /products/
features:
  - title: OnixByte Toolbox
    details: A versatile Java library providing common utilities for modern development with seamless Spring integration. Published on Maven Central.
    icon: ☕
    link: https://github.com/orgs/onixbyte-opensource/repositories?q=toolbox
  - title: Dev Lab
    details: A collection of practical web tools built with Vite and React. Features a JSON Path viewer, BMI calculator, and JSON-to-table converter.
    icon: 🛠️
    link: https://dev-lab.onixbyte.com
  - title: Helix
    details: An evolving full-stack template combining Spring Boot with React, designed to help you ship applications faster.
    icon: 🌀
    link: https://github.com/onixbyte-opensource/helix
  - title: Delta Force Guide
    details: A community-oriented guide for Delta Force, delivering game news, tips, and strategic insights for fellow operators.
    icon: 🎯
    link: https://github.com/onixbyte-opensource/ahsarah-guide

# Marketing sections, rendered below the features grid. Each block renders only
# when it has content, so commenting one out removes it cleanly.
# Reorder freely; unknown `type` values are ignored.
sections:
  - type: advantages
    id: advantages
    title: Why OnixByte
    subtitle: What shapes how we build, ship and keep software running.
    items:
      - icon: "🧩"
        title: One Team, Start to Finish
        details: Everything from the user interface and the server to the database and going live is handled by the same team, so you are not left coordinating several suppliers.
        span: 6
      - icon: "🔧"
        title: We Stay After Launch
        details: Handover is not the end of the engagement. We keep improving and supporting what we deliver, because software nobody maintains soon stops being an asset.
        span: 6
  - type: techStack
    id: tech-stack
    title: Technology We Use
    subtitle: What we build with, and what we keep running in production.
    groups:
      - name: Backend & Data
        items:
          - { name: "Java" }
          - { name: "Kotlin" }
          - { name: "Go" }
          - { name: "Rust" }
          - { name: "Spring Boot" }
          - { name: "Spring Security" }
          - { name: "MyBatis" }
          - { name: "PostgreSQL" }
          - { name: "Redis" }
      - name: Frontend
        items:
          - { name: "React" }
          - { name: "TypeScript" }
          - { name: "Vue" }
          - { name: "Tailwind CSS" }
          - { name: "Ant Design" }
          - { name: "Vite" }
      - name: Infrastructure & Delivery
        items:
          - { name: "Docker" }
          - { name: "Docker Compose" }
          - { name: "GitHub Actions" }
          - { name: "GitLab CI" }
          - { name: "MinIO" }
          - { name: "LDAP" }
      - name: Cloud & Identity
        items:
          - { name: "AWS S3" }
          - { name: "Microsoft Entra ID" }
          - { name: "JWT" }
  - type: cases
    id: work
    title: Selected Work
    subtitle: A look at some of the work we have delivered.
    items:
      # TODO(copy): no approved client testimonial yet, so this describes the
      # engagement instead. Swap in a `quote`/`author`/`role` once a client
      # agrees to be quoted. Add more entries and the card becomes a carousel.
      - company: A garment manufacturer in Guangdong
        details: A corporate marketing site built with Vue and delivered as a static site.
  - type: cta
    id: contact
    title: Let's Talk About What You Need Built
    subtitle: Tell us about your project or your idea — we are around whenever you are ready.
    actions:
      - theme: brand
        text: business@onixbyte.com
        link: mailto:business@onixbyte.com
    code:
      src: /wechat-qr.png
      caption: Or scan to reach us on WeCom
---
