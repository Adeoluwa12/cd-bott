document.addEventListener("DOMContentLoaded", () => {
    // Mark individual notification as read
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
            // Update UI
            const notificationItem = this.closest(".notification-item")
            notificationItem.classList.remove("unread")
            notificationItem.classList.add("read")
            this.remove()
          }
        } catch (error) {
          console.error("Error marking notification as read:", error)
          alert("Failed to mark notification as read")
        }
      })
    })
  
    // Mark all notifications as read
    const markAllReadBtn = document.getElementById("markAllReadBtn")
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to mark all notifications as read?")) {
          return
        }
  
        try {
          markAllReadBtn.disabled = true
          markAllReadBtn.textContent = "Processing..."
  
          // Get all unread notification IDs
          const unreadBtns = document.querySelectorAll(".notification-item.unread .mark-read-btn")
          const notificationIds = Array.from(unreadBtns).map((btn) => btn.dataset.id)
  
          // Mark each notification as read
          for (const id of notificationIds) {
            await fetch(`/notifications/${id}/read`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
          }
  
          // Update UI for all notifications
          document.querySelectorAll(".notification-item.unread").forEach((item) => {
            item.classList.remove("unread")
            item.classList.add("read")
            const btn = item.querySelector(".mark-read-btn")
            if (btn) btn.remove()
          })
  
          alert("All notifications marked as read")
        } catch (error) {
          console.error("Error marking all notifications as read:", error)
          alert("Failed to mark all notifications as read")
        } finally {
          markAllReadBtn.disabled = false
          markAllReadBtn.textContent = "Mark All as Read"
        }
      })
    }
  })
  
  