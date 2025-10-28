"use client"

import { motion } from "framer-motion"
import { usePlanStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, CheckCircle2 } from "lucide-react"

const categoryColors = {
  produce: "bg-green-500/10 text-green-700 dark:text-green-400",
  protein: "bg-red-500/10 text-red-700 dark:text-red-400",
  dairy: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  grains: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  other: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
}

export default function GroceryListView() {
  const { groceryList, toggleGroceryItem } = usePlanStore()

  const groupedItems = groceryList.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof groceryList>,
  )

  const totalItems = groceryList.length
  const purchasedItems = groceryList.filter((item) => item.purchased).length
  const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0

  if (groceryList.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Weekly Grocery List
              </CardTitle>
              <CardDescription>Your shopping list will appear here after generating a weekly plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Generate a weekly plan from the Goals page to see your grocery list
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Weekly Grocery List
            </CardTitle>
            <CardDescription>
              {purchasedItems} of {totalItems} items purchased
            </CardDescription>
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3 capitalize flex items-center gap-2">
                  <Badge className={categoryColors[category as keyof typeof categoryColors]}>{category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    ({items.filter((i) => i.purchased).length}/{items.length})
                  </span>
                </h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        item.purchased ? "bg-muted/50 border-muted" : "bg-card border-border hover:bg-accent"
                      }`}
                    >
                      <Checkbox
                        checked={item.purchased}
                        onCheckedChange={() => toggleGroceryItem(item.id)}
                        className="h-5 w-5"
                      />
                      <span className={`flex-1 ${item.purchased ? "line-through text-muted-foreground" : ""}`}>
                        {item.name}
                      </span>
                      {item.purchased && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
