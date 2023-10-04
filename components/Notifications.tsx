'use client'
import { CONFIG } from "@/config"
import { saveSubscription } from "@/utils/db"
import { registerServiceWorker, unregisterServiceWorkers } from "@/utils/sw"

// Works on desktop as well
const notificationsSupported = () => 
    'Notification' in window && 
    'serviceWorker' in navigator && 
    'PushManager' in window

// Would restrict to PWA only    
const isPWA = () => window.matchMedia('(display-mode: standalone)').matches

export default function Notifications() {
    if (!notificationsSupported()){
        return <h3>Please install the PWA first</h3>
    } else {
    return <>
        <h3 className="">Hour Market PWA</h3>
        <button className="btn btn-primary" onClick={subscribe}>Ask permission and subscribe!</button>
    </>
    }
}

const subscribe = async () => {
    await unregisterServiceWorkers()

    const swRegistration = await registerServiceWorker()
    await window?.Notification.requestPermission()

    try {
        
        const options = {
            applicationServerKey: CONFIG.PUBLIC_KEY,
            userVisibleOnly: true
        }
        const subscription = await swRegistration.pushManager.subscribe(options)

        await saveSubscription(subscription)

        console.log('sw.subscription.saved', { subscription })

    } catch (error) {
        
        console.error('sw.subscription.save.error', error)

    }
}