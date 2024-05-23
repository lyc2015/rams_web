# LYC homes Web

## 1. 安装依赖（使用 Yarn 或 npm）

### 使用 Yarn（推荐使用）

- 安装 Yarn（ Windows 需要使用管理员打开）
```bash
npm install --global yarn
```
- 使用以下命令来安装项目的依赖：
```bash
yarn install
```

### 使用 npm

- 安装 Node.js

- 使用以下命令来安装项目的依赖：
```bash
npm install
```

## 2. 启动项目

> 你可以使用 Yarn 或 npm 来启动项目：

```bash
yarn start
```
Node 版本太高需要添加 `NODE_OPTIONS=--openssl-legacy-provider`

```bash
NODE_OPTIONS=--openssl-legacy-provider yarn start
```

或者

```bash
npm start
```

## 3. 访问页面

启动项目后，可以通过以下地址访问不同的页面：

- 登录页面: http://localhost:3000/
- 子菜单页面: http://localhost:3000/submenu

