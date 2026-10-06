"""Original 16-bar instrumental, composed for this portfolio. No sampled assets.
Run with Python 3 to regenerate the browser-compatible WAV.
"""
import array
import math
import wave
from pathlib import Path

RATE = 22050
BEAT = 60 / 72
LENGTH = 64 * BEAT
COUNT = round(LENGTH * RATE)
samples = array.array('f', [0.0]) * COUNT

def voice(midi, start, duration, gain, decay, pad=False):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    begin = round(start * RATE)
    for i in range(round(duration * RATE)):
        t = i / RATE
        attack = 1 - math.exp(-t / (0.32 if pad else 0.014))
        release = min(1, max(0, (duration - t) / 0.35))
        envelope = attack * math.exp(-t / decay) * release
        phase = math.tau * frequency * t
        tone = math.sin(phase) * 0.72 + math.sin(phase * 1.0008) * 0.16
        if not pad:
            tone += math.sin(phase * 2) * 0.18 * math.exp(-t / 0.8)
            tone += math.sin(phase * 3) * 0.06 * math.exp(-t / 0.3)
        samples[(begin + i) % COUNT] += tone * envelope * gain

chords = [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 55]]
melodies = [
    [72, None, 76, None, 79, 76, 74, None],
    [71, None, 74, 76, None, 72, 69, None],
    [69, 72, None, 76, 74, None, 72, None],
    [67, None, 71, 74, None, 72, 71, None],
]
for bar in range(16):
    chord = chords[bar % 4]
    start = bar * 4 * BEAT
    for note in chord:
        voice(note, start, 5.2, 0.022, 6, pad=True)
    voice(chord[0] - 12, start, 3.1, 0.043, 1.5)
    for step in range(8):
        note = chord[[0, 1, 2, 3, 2, 1, 3, 2][step]] + 12
        voice(note, start + step * BEAT / 2, 2.9, 0.033 if step % 2 == 0 else 0.021, 1.2)
    melody = melodies[bar % 4]
    for step, note in enumerate(melody):
        if note is not None:
            variation = -12 if bar >= 12 and step % 3 == 0 else 0
            voice(note + variation, start + step * BEAT / 2, 3.4, 0.085 if bar >= 4 else 0.064, 1.55)

# Circular stereo-like echoes preserve the tails at the loop boundary.
dry = samples[:]
for delay, amount in [(0.071, 0.15), (0.137, 0.08), (BEAT * 1.5, 0.22), (BEAT * 3, 0.1)]:
    shift = round(delay * RATE)
    for i, value in enumerate(dry):
        samples[(i + shift) % COUNT] += value * amount
peak = max(abs(s) for s in samples)
encoded = array.array('h', (round(math.tanh(s / peak * 1.08) * 23500) for s in samples))
output = Path(__file__).resolve().parents[1] / 'public' / 'audio' / 'railway-theme.wav'
output.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(output), 'wb') as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(RATE)
    wav.writeframes(encoded.tobytes())
print(f'{output}: {LENGTH:.2f}s, peak {max(abs(s) for s in encoded) / 32768:.3f}')
