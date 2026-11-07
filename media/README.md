# media

Исходники медиа — в сборку не попадают и в git не коммитятся (`media/originals/` в `.gitignore`, лежат только локально).

- `originals/` — оригиналы фото в полном качестве.

Готовые для сайта версии:
- `src/assets/images/` — картинки, которые импортируются в код (Vite добавляет хэш в имя).
- `public/` — файлы с фиксированным URL: фавиконки, `images/og.jpg` для превью ссылок.

Пересобрать аватар и иконки из оригинала:

```bash
ffmpeg -i media/originals/daniel-portrait.png -vf "crop=920:920:116:150,scale=384:384:flags=lanczos" /tmp/avatar.png
cwebp -q 86 /tmp/avatar.png -o src/assets/images/avatar.webp
ffmpeg -y -i media/originals/daniel-portrait.png -vf "crop=920:920:116:150,scale=180:180" public/apple-touch-icon.png
ffmpeg -y -i media/originals/daniel-portrait.png -vf "crop=920:920:116:150,scale=64:64" public/favicon.png
ffmpeg -y -i media/originals/daniel-portrait.png -vf "scale=1200:-1,crop=1200:630:0:290" -q:v 3 public/images/og.jpg
```
