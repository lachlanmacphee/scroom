import React from "react";

export default function convertRole(role: string) {
  if (role === "productOwner") return "Product Owner";
  if (role === "admin") return "Admin";
  if (role === "scrumMaster") return "Scrum Master";
  if (role === "guest") return "Guest";
}
