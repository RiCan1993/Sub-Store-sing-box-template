
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

// Push proxy tags to main selector and auto urltest
config.outbounds.forEach(outbound => {
  if (outbound.type === 'selector' && outbound.tag === '🚀 节点选择') {
    outbound.outbounds.push(...proxyTags)
  }
  if (outbound.type === 'urltest' && outbound.tag === '🎈 自动选择') {
    outbound.outbounds.push(...proxyTags)
  }
  if (outbound.type === 'selector' && outbound.tag === '🤖 AI服务') {
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
