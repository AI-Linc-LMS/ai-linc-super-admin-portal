export default function Settings() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      <form className="grid gap-4 max-w-lg">
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Organization Name</span>
          <input className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500" placeholder="AI Linc" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Support Email</span>
          <input type="email" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500" placeholder="support@example.com" />
        </label>
        <div>
          <button type="button" className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save</button>
        </div>
      </form>
    </div>
  )
}
