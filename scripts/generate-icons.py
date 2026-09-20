"""Generate the simple PWA icons without third-party packages."""
from pathlib import Path
import struct
import zlib


def png(path: Path, size: int) -> None:
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            edge = min(x, y, size - 1 - x, size - 1 - y)
            if edge < size // 18:
                row.extend((232, 220, 193, 255))
            elif x > size * 0.22 and x < size * 0.78 and y > size * 0.18 and y < size * 0.82:
                row.extend((27, 111, 104, 255))
            else:
                row.extend((247, 243, 235, 255))
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)

    content = b"\x89PNG\r\n\x1a\n"
    content += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    content += chunk(b"IDAT", zlib.compress(raw, 9))
    content += chunk(b"IEND", b"")
    path.write_bytes(content)


out = Path(__file__).resolve().parents[1] / "public"
for filename, size in (("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)):
    png(out / filename, size)
