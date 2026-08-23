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

config.outbounds.forEach(outbound => {
  if (outbound.type === 'selector' && outbound.tag === '🚀 节点选择') {
    outbound.outbounds.push(...proxyTags)
  }
  if (outbound.type === 'urltest' && outbound.tag === '🎈 自动选择') {
    outbound.outbounds.push(...proxyTags)
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)
