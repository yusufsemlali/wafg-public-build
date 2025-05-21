"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignUpForm } from "@/components/sign-up-form"

export function SignUpModal() {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <SignUpForm />
      </DialogContent>
    </Dialog>
  )
}
