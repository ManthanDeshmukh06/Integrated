export default function NavItem({ icon, label, open }) {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-100 cursor-pointer">
      {icon}
      {open && <span className="text-gray-700 font-medium">{label}</span>}
    </div>
  );
}
