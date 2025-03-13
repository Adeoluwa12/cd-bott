document.addEventListener("DOMContentLoaded", () => {
    // Check referrals button
    const checkReferralsBtn = document.getElementById("checkReferralsBtn")
    if (checkReferralsBtn) {
      checkReferralsBtn.addEventListener("click", async () => {
        try {
          checkReferralsBtn.disabled = true
          checkReferralsBtn.textContent = "Checking..."
  
          const response = await fetch("/api/availity/check-referrals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
  
          if (response.ok) {
            alert("Referral check completed successfully!")
            window.location.reload()
          } else {
            const data = await response.json()
            alert(`Error: ${data.message}`)
          }
        } catch (error) {
          alert(`Error: ${error.message}`)
        } finally {
          checkReferralsBtn.disabled = false
          checkReferralsBtn.textContent = "Check Referrals Now"
        }
      })
    }
  
    // Reset session button
    const resetSessionBtn = document.getElementById("resetSessionBtn")
    if (resetSessionBtn) {
      resetSessionBtn.addEventListener("click", async () => {
        try {
          if (!confirm("Are you sure you want to reset the browser session? This will log you out of Availity.")) {
            return
          }
  
          resetSessionBtn.disabled = true
          resetSessionBtn.textContent = "Resetting..."
  
          const response = await fetch("/api/availity/reset", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
  
          if (response.ok) {
            alert("Browser session reset successfully!")
          } else {
            const data = await response.json()
            alert(`Error: ${data.message}`)
          }
        } catch (error) {
          alert(`Error: ${error.message}`)
        } finally {
          resetSessionBtn.disabled = false
          resetSessionBtn.textContent = "Reset Session"
        }
      })
    }
  
    // Mark notification as read
    const markReadBtns = document.querySelectorAll(".mark-read-btn")
    markReadBtns.forEach((btn) => {
      btn.addEventListener("click", async function () {
        const notificationId = this.dataset.id
  
        try {
          const response = await fetch(`/notifications/${notificationId}/read`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
  
          if (response.ok) {
            // Remove the notification or mark it as read visually
            const notificationItem = this.closest(".notification-item")
            notificationItem.classList.add("read")
            this.remove()
          }
        } catch (error) {
          console.error("Error marking notification as read:", error)
        }
      })
    })
  })
  
  