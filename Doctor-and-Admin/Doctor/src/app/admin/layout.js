// // src/app/layout.js
// import './globals.css'; // Import your global CSS including Tailwind

// export const metadata = {
//   title: 'Hospital Dashboard',
//   description: 'Smart Healthcare Management System',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50">
//         {children}
//       </body>
//     </html>
//   );
// }
export default function AdminLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar, header, or navbar can go here */}
      {children}
    </div>
  );
}
