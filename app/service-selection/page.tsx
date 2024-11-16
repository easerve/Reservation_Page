'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"

export default function Component() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const services = {
    main: [
      { id: 'grooming', name: '미용', price: '50,000원' },
      { id: 'hotel', name: '호텔', price: '40,000원' },
      { id: 'pickup', name: '픽업', price: '15,000원' }
    ],
    additional: [
      { id: 'spa', name: '스파', price: '30,000원' },
      { id: 'training', name: '훈련', price: '45,000원' },
      { id: 'walking', name: '산책', price: '20,000원' }
    ]
  }

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/pet-info">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">서비스 선택</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">메인 서비스</h2>
            <div className="space-y-2">
              {services.main.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  className={`w-full justify-between h-auto py-4 ${
                    selectedServices.includes(service.id) 
                      ? 'border-green-500 bg-green-50' 
                      : ''
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <span>{service.name}</span>
                  <span className="text-sm text-muted-foreground">{service.price}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">추가 서비스</h2>
            <div className="space-y-2">
              {services.additional.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  className={`w-full justify-between h-auto py-4 ${
                    selectedServices.includes(service.id) 
                      ? 'border-green-500 bg-green-50' 
                      : ''
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <span>{service.name}</span>
                  <span className="text-sm text-muted-foreground">{service.price}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        className="w-full mt-6 bg-green-500 hover:bg-green-600"
        disabled={selectedServices.length === 0}
        asChild
      >
        <Link href="/inquiry">다음</Link>
      </Button>
    </div>
  )
}
