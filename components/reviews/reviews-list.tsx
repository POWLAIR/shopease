"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, Star } from "lucide-react"
import { buildApiUrl } from "@/lib/api"

export function ReviewsList() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [productId, setProductId] = useState("")

  const loadReviews = async () => {
    if (!productId) return

    setLoading(true)
    try {
      const res = await fetch(buildApiUrl(`/api/avis/${productId}`))
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      } else {
        setReviews([])
      }
    } catch (error) {
      console.error("[v0] Error loading reviews:", error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechercher les avis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="productId">ID du produit</Label>
            <Input
              id="productId"
              placeholder="Entrez l'ID du produit"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          <Button onClick={loadReviews} disabled={loading || !productId} className="mt-auto">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {productId ? "Aucun avis trouvé pour ce produit" : "Entrez un ID de produit pour rechercher"}
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.auteur?.nom || "Anonyme"}</p>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.note ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.auteur?.email}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <p className="mt-3 text-sm">{review.commentaire}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
