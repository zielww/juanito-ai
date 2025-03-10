"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BeachRulesPopupProps {
  onClose: () => void
}

export default function BeachRulesPopup({ onClose }: BeachRulesPopupProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Beach Rules & Best Practices</DialogTitle>
          <DialogDescription className="text-center">
            Help us preserve the beauty of San Juan, Batangas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600 text-lg">🗑️</span>
            </div>
            <div>
              <h3 className="font-medium">No Littering</h3>
              <p className="text-sm text-gray-600">Please dispose of your trash properly in designated bins.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600 text-lg">🌊</span>
            </div>
            <div>
              <h3 className="font-medium">Respect Marine Life</h3>
              <p className="text-sm text-gray-600">Do not touch or disturb coral reefs and marine animals.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600 text-lg">🏊</span>
            </div>
            <div>
              <h3 className="font-medium">Swim Safely</h3>
              <p className="text-sm text-gray-600">Follow lifeguard instructions and swim only in designated areas.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600 text-lg">🌱</span>
            </div>
            <div>
              <h3 className="font-medium">Support Local</h3>
              <p className="text-sm text-gray-600">Purchase from local vendors and respect the community.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Remind me later
          </Button>
          <Button onClick={onClose}>I understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

