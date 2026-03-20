import { useRef, useCallback } from 'react'

export function useSoundFX() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  // ── Pristine silver-bowl water-drop chime ──────────────────────────
  const chime = useCallback((note = 0) => {
    const ctx = getCtx()
    const t = ctx.currentTime

    const fundamentals = [1046.5, 1318.5, 1568.0, 2093.0]
    const freq = fundamentals[note % fundamentals.length]

    const partials = [
      { ratio: 1.0,    amp: 0.28,  decay: 3.2  },
      { ratio: 2.756,  amp: 0.14,  decay: 1.8  },
      { ratio: 5.404,  amp: 0.07,  decay: 1.1  },
      { ratio: 8.933,  amp: 0.035, decay: 0.7  },
      { ratio: 13.34,  amp: 0.016, decay: 0.42 },
      { ratio: 18.64,  amp: 0.008, decay: 0.22 },
    ]

    const reverbNode = (() => {
      const len = ctx.sampleRate * 2.8
      const buf = ctx.createBuffer(2, len, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch)
        for (let i = 0; i < len; i++) {
          const decay = Math.exp(-i / (ctx.sampleRate * 0.9))
          d[i] = (Math.random() * 2 - 1) * decay * (ch === 0 ? 1 : 0.92)
        }
      }
      const conv = ctx.createConvolver()
      conv.buffer = buf
      return conv
    })()

    const dryGain = ctx.createGain();  dryGain.gain.value = 0.55
    const wetGain = ctx.createGain();  wetGain.gain.value = 0.45
    const master  = ctx.createGain()

    master.gain.setValueAtTime(0, t)
    master.gain.linearRampToValueAtTime(0.0001, t)
    master.gain.linearRampToValueAtTime(1.0, t + 0.018)
    master.gain.setValueAtTime(1.0, t + 0.018)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 3.5)

    const stereoL = ctx.createStereoPanner(); stereoL.pan.value = -0.3
    const stereoR = ctx.createStereoPanner(); stereoR.pan.value =  0.3

    reverbNode.connect(wetGain)
    wetGain.connect(master)
    master.connect(ctx.destination)

    partials.forEach(({ ratio, amp, decay: partialDecay }, i) => {
      const f = freq * ratio
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      osc.frequency.setValueAtTime(f * 1.003, t)
      osc.frequency.exponentialRampToValueAtTime(f, t + 0.04)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(amp, t + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + partialDecay)
      osc.connect(gain)
      if (i % 2 === 0) {
        gain.connect(stereoL)
        stereoL.connect(dryGain)
        stereoL.connect(reverbNode)
      } else {
        gain.connect(stereoR)
        stereoR.connect(dryGain)
        stereoR.connect(reverbNode)
      }
      dryGain.connect(master)
      osc.start(t)
      osc.stop(t + partialDecay + 0.1)
    })

    const sub  = ctx.createOscillator()
    const subG = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.value = freq * 0.5
    subG.gain.setValueAtTime(0, t)
    subG.gain.linearRampToValueAtTime(0.06, t + 0.008)
    subG.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    sub.connect(subG)
    subG.connect(master)
    sub.start(t); sub.stop(t + 0.4)
  }, [getCtx])

  // ── Nav: soft barely-there click ──────────────────────────────────
  const navThud = useCallback(() => {
    const ctx = getCtx()
    const t = ctx.currentTime

    const bufSize = Math.floor(ctx.sampleRate * 0.008)
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      const env = Math.sin((i / bufSize) * Math.PI)
      d[i] = (Math.random() * 2 - 1) * env
    }
    const src = ctx.createBufferSource()
    src.buffer = buf

    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 680
    bp.Q.value = 0.8

    const gain = ctx.createGain()
    gain.gain.value = 0.12

    src.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)

    src.start(t)
    src.stop(t + 0.012)
  }, [getCtx])

  // ── Delicate tick for list items / micro interactions ──────────────
  const tick = useCallback(() => {
    const ctx = getCtx()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(3200, t)
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.018)
    filter.type = 'highpass'
    filter.frequency.value = 800
    gain.gain.setValueAtTime(0.07, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03)
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    osc.start(t); osc.stop(t + 0.04)
  }, [getCtx])

  // ── Soft release whoosh for particle dissolve ──────────────────────
  const whoosh = useCallback(() => {
    const ctx = getCtx()
    const t = ctx.currentTime
    const bufSize = ctx.sampleRate * 0.4
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2400, t)
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.35)
    filter.Q.value = 1.2
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    src.start(t); src.stop(t + 0.4)
  }, [getCtx])

  // ── Soft pop for toggling soundscape orbs ─────────────────────────
  const orbPop = useCallback((on = true) => {
    const ctx = getCtx()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    if (on) {
      osc.frequency.setValueAtTime(200, t)
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.06)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.13, t + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    } else {
      osc.frequency.setValueAtTime(380, t)
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.08)
      gain.gain.setValueAtTime(0.1, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
    }
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(t); osc.stop(t + 0.15)
  }, [getCtx])

  return { navThud, chime, tick, whoosh, orbPop }
}