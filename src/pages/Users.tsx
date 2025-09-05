export default function Users() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td className="py-2">Jane Doe</td>
              <td className="py-2">jane@example.com</td>
              <td className="py-2">Admin</td>
            </tr>
            <tr>
              <td className="py-2">John Smith</td>
              <td className="py-2">john@example.com</td>
              <td className="py-2">Editor</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
