"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
export default function Game() {
    return (
        <div>
            <Label>GameCode</Label>
            <Input
                id="game code"
                value="game code"
                required
            />

        </div>
    )
}