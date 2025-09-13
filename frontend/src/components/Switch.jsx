import { Switch as HeadlessSwitch } from "@headlessui/react";

export function Switch({ enabled, onChange }) {
  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
    >
      <span className={`${enabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </HeadlessSwitch>
  );
}