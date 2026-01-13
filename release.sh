#!/usr/bin/env sh

# 遇到错误时停止执行
set -e

echo "🚀 开始发布流程..."

# 0. 选择版本升级类型
echo "请选择版本升级类型 (Select version upgrade type):"
echo "1) Patch (x.x.1) - 修复 Bug (Bug fixes)"
echo "2) Minor (x.1.x) - 新功能 (New features)"
echo "3) Major (1.x.x) - 重大变更 (Breaking changes)"
read -p "请输入选项 [1-3]: " version_type

case $version_type in
    1) npm version patch ;;
    2) npm version minor ;;
    3) npm version major ;;
    *) echo "❌ 无效选项 (Invalid choice)"; exit 1 ;;
esac

echo "✅ 版本号已更新！"

# 1. 构建库 (确保发布的是最新代码)
echo "📦 正在构建库文件的压缩包..."
npm run build:lib

# 2. 提示用户确认 (可选，防止手滑)
# read -p "确认发布到 NPM 吗? (y/n) " -n 1 -r
# echo
# if [[ ! $REPLY =~ ^[Yy]$ ]]
# then
#     exit 1
# fi

# 3. 发布到 NPM
echo "⬆️  正在发布到 NPM..."
# --access public 对于带有 @scope 的包是必须的，普通包也没影响
npm publish --access public

echo "✅ 发布完成！"
