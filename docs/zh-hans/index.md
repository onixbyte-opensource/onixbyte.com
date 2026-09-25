---
pageType: home

hero:
  name: OnixByte
  tagline: 设计、构建并长期维护您的核心业务系统。
  actions:
    - theme: brand
      text: 了解定制服务
      link: /services/
    - theme: alt
      text: 查看产品
      link: /products/
features:
  - title: OnixByte Toolbox
    details: 一个多功能 Java 类库，为现代 Java 开发提供通用工具，无缝集成 Spring 生态。已上架 Maven Central。
    icon: ☕
    link: https://github.com/orgs/onixbyte-opensource/repositories?q=toolbox
  - title: Dev Lab
    details: 基于 Vite 和 React 构建的实用在线工具集。包含 JSON Path 查看器、BMI 计算器以及 JSON 转表格工具。
    icon: 🛠️
    link: https://dev-lab.onixbyte.com
  - title: Helix
    details: 一个不断演进的前后端模版项目，结合 Spring Boot 与 React，助你快速构建应用。
    icon: 🌀
    link: https://github.com/onixbyte-opensource/helix
  - title: Delta Force Guide
    details: 社区向的《三角洲行动》游戏指南，提供最新游戏资讯、实用技巧和战术策略。
    icon: 🎯
    link: https://github.com/onixbyte-opensource/ahsarah-guide

# 营销区块，渲染在项目网格下方。每个区块仅在有内容时渲染，
# 注释掉即整块消失，不会留下空位。
# 区块顺序可自由调整；无法识别的 `type` 会被忽略。
sections:
  - type: advantages
    id: advantages
    title: 为什么选择曜珀科技
    subtitle: 塑造我们交付与维护方式的原则。
    items:
      - icon: "🧩"
        title: 一支团队负责到底
        details: 从用户界面、服务端、数据库到上线部署，全部由同一个团队承接，您不必在多个供应商之间来回协调。
        span: 6
      - icon: "🔧"
        title: 上线之后我们还在
        details: 交付不是合作的终点。我们对上线的系统持续改进与支持 —— 没人维护的软件，很快就不能再算作资产。
        span: 6
  - type: techStack
    id: tech-stack
    title: 技术栈
    subtitle: 我们用来构建、以及在生产环境长期运行的技术。
    groups:
      - name: 后端与数据
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
      - name: 前端
        items:
          - { name: "React" }
          - { name: "TypeScript" }
          - { name: "Vue" }
          - { name: "Tailwind CSS" }
          - { name: "Ant Design" }
          - { name: "Vite" }
      - name: 基础设施与交付
        items:
          - { name: "Docker" }
          - { name: "Docker Compose" }
          - { name: "GitHub Actions" }
          - { name: "GitLab CI" }
          - { name: "MinIO" }
          - { name: "LDAP" }
      - name: 云服务与身份
        items:
          - { name: "AWS S3" }
          - { name: "Microsoft Entra ID" }
          - { name: "JWT" }
  - type: cases
    id: work
    title: 项目实践
    subtitle: 我们交付过的一些项目。
    items:
      # TODO(copy): 目前没有客户授权引语，因此改为描述项目本身。等客户同意具名
      # 评价后，把 quote / author / role 换成引语。再加条目就会变成轮播。
      - company: 广东省一家服饰制造企业
        details: 基于 Vue 的企业宣传站点，以静态站点形式交付。
  - type: cta
    id: contact
    title: 聊聊您要做的事
    subtitle: 聊聊您的项目或想法，我们随时在线。
    actions:
      - theme: brand
        text: business@onixbyte.com
        link: mailto:business@onixbyte.com
    code:
      src: /wechat-qr.png
      caption: 或者扫码加企业微信
---
