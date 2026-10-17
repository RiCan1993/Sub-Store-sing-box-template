
const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

const proxyTags = proxies.map(p => p.tag)

// Add proxy tags to these selector and urltest groups. Add new group names here.
const proxyGroupTags = [
  '🚀 节点选择',
  '🎈 自动选择',
  '🧠 AI服务',
  '🍎 苹果服务',
]

config.outbounds.forEach(outbound => {
  if (['selector', 'urltest'].includes(outbound.type) && proxyGroupTags.includes(outbound.tag)) {
    outbound.outbounds.push(...proxyTags)
  }
})

// Fill empty outbounds with COMPATIBLE fallback
config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag)
  }
})

// Windows 专用：关闭 TUN 自动路由
const tun = config.inbounds?.find(
  inbound => inbound.tag === 'tun-in'
)

if (tun) {
  tun.auto_route = false
}

$content = JSON.stringify(config, null, 2)
