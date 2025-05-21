"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { UpdatePasswordForm } from "@/components/update-password-form"

export function UpdatePasswordModal() {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <UpdatePasswordForm />
      </DialogContent>
    </Dialog>
  )
}
