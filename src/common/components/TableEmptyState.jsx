import React from "react";

export default function TableEmptyState({ colSpan, message }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-6 py-10 text-center text-stone-400 font-bold"
      >
        {message}
      </td>
    </tr>
  );
}
