const fs = require('fs');
const path = require('path');

const pages = [
  'Dashboard', 'Products', 'Categories', 'Customers', 
  'Orders', 'Payments', 'Reports'
];

const dir = path.join(__dirname, 'src', 'pages', 'admin');

pages.forEach(page => {
  const content = `const ${page} = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">${page}</h1>
      <p className="text-gray-500">Coming soon in the next phase...</p>
    </div>
  );
};

export default ${page};
`;
  fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
});

console.log('Admin pages generated.');
