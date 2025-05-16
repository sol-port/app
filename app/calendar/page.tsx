"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, Check, Info } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { getNotifications } from "@/lib/api/client"

export default function CalendarPage() {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: t("notifications.rebalancingAlert"),
      message: t("notifications.rebalancingMessage").replace("{percent}", "5.3"),
      date: "2025-05-10 14:32",
      read: false,
      actionable: true,
      actionLabel: t("notifications.executeRebalancing"),
    },
    {
      id: 2,
      type: "info",
      title: t("notifications.priceAlert"),
      message: t("notifications.priceMessage").replace("{percent}", "12.5"),
      date: "2025-05-10 09:15",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: t("notifications.apyUpdate"),
      message: t("notifications.apyMessage").replace("{percent}", "9.8").replace("{change}", "0.4"),
      date: "2025-05-09 18:45",
      read: false,
    },
    {
      id: 4,
      type: "success",
      title: t("notifications.contributionConfirmation"),
      message: t("notifications.contributionMessage"),
      date: "2025-05-05 00:00",
      read: true,
    },
    {
      id: 5,
      type: "success",
      title: t("notifications.goalUpdate"),
      message: t("notifications.goalMessage").replace("{percent}", "32").replace("{probability}", "92"),
      date: "2025-05-01 12:00",
      read: true,
    },
  ])

  useEffect(() => {
    async function fetchNotifications() {
      try {
        // In a real app, you would get the wallet address from the wallet adapter
        // For now, we'll use a dummy address
        const walletAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
        const data = await getNotifications(walletAddress)

        if (data && Array.isArray(data)) {
          // Transform the API data to match our component's expected format
          const transformedNotifications = data.map((notification: any, index: number) => ({
            id: index + 1,
            type: notification.level === "critical" ? "alert" : notification.level === "major" ? "info" : "success",
            title: notification.title,
            message: notification.desc,
            date: new Date().toISOString().replace("T", " ").substring(0, 16), // Mock date
            read: false,
            actionable: notification.level === "critical",
            actionLabel: notification.level === "critical" ? t("notifications.executeRebalancing") : undefined,
          }))

          setNotifications(transformedNotifications)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        // Keep the mock data as fallback
      }
    }

    fetchNotifications()
  }, [t])

  // Count unread, urgent, and important notifications
  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentCount = notifications.filter((n) => n.type === "alert" && !n.read).length
  const importantCount = notifications.filter((n) => (n.type === "alert" || n.type === "info") && !n.read).length

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "info":
        return <Info className="h-6 w-6 text-amber-500" />
      case "success":
        return <Check className="h-6 w-6 text-green-500" />
      default:
        return <Bell className="h-6 w-6 text-solport-textSecondary" />
    }
  }

  return (
    <DashboardLayout title={t("notifications.title")}>
      {/* Notification Status Overview */}
      <Card className="bg-solport-card border-0 mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-solport-textSecondary">
                {t("notifications.unread").replace("{count}", unreadCount.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("notifications.urgent").replace("{count}", urgentCount.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("notifications.important").replace("{count}", importantCount.toString())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-solport-card w-full justify-start">
          <TabsTrigger value="all" className="data-[state=active]:bg-solport-accent">
            {t("notifications.all")}
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-solport-accent">
            {t("notifications.market")}
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-solport-accent">
            {t("notifications.portfolio")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-0 ${notification.read ? "bg-[#1a1e30]" : "bg-solport-card"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-[#273344]">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-solport-textSecondary mt-1">{notification.message}</p>
                        <p className="text-xs text-solport-textSecondary mt-2">{notification.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        {notification.actionable && (
                          <Button size="sm" className="bg-solport-accent hover:bg-solport-accent2 text-xs">
                            {notification.actionLabel}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-solport-textSecondary text-solport-textSecondary hover:bg-[#273344] hover:text-white text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {notification.read ? t("notifications.dismiss") : t("notifications.markAsRead")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {unreadCount > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="bg-transparent border-solport-accent text-solport-accent hover:bg-solport-accent hover:text-white"
                onClick={markAllAsRead}
              >
                {t("notifications.markAsRead")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
