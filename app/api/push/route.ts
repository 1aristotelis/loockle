import { CONFIG } from "@/config";
import { getSubscriptionsFromDb, saveSubscriptionToDb } from "@/utils/in-memory-db";
import { NextRequest, NextResponse } from "next/server";
import webpush, { PushSubscription } from "web-push"

webpush.setVapidDetails(
    'mailto:©aristotelis@relayx.io',
    CONFIG.PUBLIC_KEY,
    CONFIG.PRIVATE_KEY
)

export async function POST(request: NextRequest) {
    const subscription = (await request.json()) as PushSubscription | null

    if(!subscription) {
        console.error('no subscription was provided')
        return
    }

    const updateDb = await saveSubscriptionToDb(subscription)

    return NextResponse.json({ message: 'success', updateDb })

}

export async function GET(_: NextRequest) {
    const subscriptions = await getSubscriptionsFromDb()

    subscriptions.forEach((s) => {
        const payload = JSON.stringify({
            title: 'Hour Market Notification', 
            body: 'Hello, World!'
        })
        webpush.sendNotification(s, payload)
    })

    return NextResponse.json({ message: `${subscriptions.length} messages sent!`})

}