import React from "react";
// No auth yet—let everyone through.
export default function GuestRoute({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
