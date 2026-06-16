'use client'

import React, { useEffect, useState, memo } from 'react'
import Script from 'next/script'

interface SplineSceneProps {
    scene: string
    className?: string
}

export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // ── SHADOW DOM LOGO REMOVER & GLOBAL MOUSE SANDBOX ENGINE ──
    useEffect(() => {
        if (!isMounted) return

        const viewer = document.querySelector('spline-viewer') as HTMLElement | null

        const scrubSplineLogo = () => {
            if (viewer && viewer.shadowRoot) {
                const logoElement = viewer.shadowRoot.getElementById('logo')
                if (logoElement) {
                    logoElement.style.display = 'none'
                    return true
                }
            }
            return false
        }

        if (!scrubSplineLogo()) {
            const liveInterval = setInterval(() => {
                if (scrubSplineLogo()) clearInterval(liveInterval)
            }, 100)
            const safetyTimeout = setTimeout(() => clearInterval(liveInterval), 6000)
        }

        if (!viewer) return

        // ── STEP 1: BLOCK THE RESET TRIGGERS ──
        // Kills the exit flags so Spline never freezes or resets the robot's head coordinates
        const blockExitReset = (e: Event) => {
            e.stopImmediatePropagation()
            e.stopPropagation()
            e.preventDefault()
        }

        viewer.addEventListener('mouseleave', blockExitReset, true)
        viewer.addEventListener('mouseout', blockExitReset, true)
        viewer.addEventListener('pointerleave', blockExitReset, true)
        viewer.addEventListener('pointerout', blockExitReset, true)

        // ── STEP 2: GLOBAL BOUNDARY CLAMP COORDINATOR ──
        const handleGlobalPointerMove = (e: MouseEvent) => {
            const rect = viewer.getBoundingClientRect()

            // Dynamically clamp coordinates to be strictly 2 pixels inside the canvas window context
            const clampedX = Math.max(rect.left + 2, Math.min(rect.right - 2, e.clientX))
            const clampedY = Math.max(rect.top + 2, Math.min(rect.bottom - 2, e.clientY))

            // Create synthetic multi-event packages (handles both old mouse and modern pointer loops)
            const mouseEventParams = {
                clientX: clampedX,
                clientY: clampedY,
                screenX: clampedX + window.screenX,
                screenY: clampedY + window.screenY,
                bubbles: true,
                cancelable: true,
                view: window
            }

            const mEvt = new MouseEvent('mousemove', mouseEventParams)
            const pEvt = new PointerEvent('pointermove', {
                ...mouseEventParams,
                pointerId: 1,
                isPrimary: true
            })

            // Dispatch the proxy stream downstream directly into the WebGL core matrix loops
            viewer.dispatchEvent(mEvt)
            viewer.dispatchEvent(pEvt)

            if (viewer.shadowRoot) {
                const canvas = viewer.shadowRoot.querySelector('canvas')
                if (canvas) {
                    canvas.dispatchEvent(mEvt)
                    canvas.dispatchEvent(pEvt)
                }
            }
        }

        window.addEventListener('mousemove', handleGlobalPointerMove, true)

        return () => {
            viewer.removeEventListener('mouseleave', blockExitReset, true)
            viewer.removeEventListener('mouseout', blockExitReset, true)
            viewer.removeEventListener('pointerleave', blockExitReset, true)
            viewer.removeEventListener('pointerout', blockExitReset, true)
            window.removeEventListener('mousemove', handleGlobalPointerMove, true)
        }
    }, [isMounted])

    if (!isMounted) {
        return (
            <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-transparent">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className={`w-full h-full min-h-[450px] relative flex items-center justify-center overflow-visible bg-transparent transition-all duration-300 ${className || ''}`}>
            <Script
                src="https://unpkg.com/@splinetool/viewer@1.9.54/build/spline-viewer.js"
                type="module"
                strategy="afterInteractive"
            />

            <div
                className="w-full h-full absolute inset-0 z-10 overflow-visible"
                dangerouslySetInnerHTML={{
                    __html: `<spline-viewer url="${scene}" style="width: 100%; height: 100%; display: block;"></spline-viewer>`
                }}
            />
        </div>
    )
})