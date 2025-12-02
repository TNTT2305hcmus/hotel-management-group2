const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Danh sách thư mục cần tạo
const directories = [
  'public/css',
  'public/js',
  'public/images',
  'public/fonts',
  'src/config',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/middlewares',
  'src/services',
  'src/utils',
  'views/layouts',
  'views/partials',
  'views/pages',
  'views/errors',
  'uploads',
  'logs',
  'tests/unit',
  'tests/integration'
];

// Danh sách file cần tạo
const files = {
  'server.js': '',
  'app.js': '',
  '.env': 'PORT=3000\nNODE_ENV=development\n',
  '.env.example': 'PORT=3000\nNODE_ENV=development\n',
  '.gitignore': 'node_modules/\n.env\nlogs/\nuploads/*\n!uploads/.gitkeep\n',
  'README.md': '# My Web App\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Run\n\n```bash\nnpm run dev\n```\n',
  'uploads/.gitkeep': ''
};

console.log('Đang tạo cấu trúc dự án...\n');

// Tạo thư mục
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Đã tạo: ${dir}`);
  }
});

// Tạo file
Object.keys(files).forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, files[file]);
    console.log(`Đã tạo: ${file}`);
  }
});