document.addEventListener("DOMContentLoaded", () => {
    // Add backup codes form
    const addCodesForm = document.getElementById("addCodesForm")
    if (addCodesForm) {
      addCodesForm.addEventListener("submit", async (e) => {
        e.preventDefault()
  
        const backupCodesTextarea = document.getElementById("backupCodes")
        const backupCodesText = backupCodesTextarea.value.trim()
  
        if (!backupCodesText) {
          alert("Please enter at least one backup code")
          return
        }
  
        // Split by newlines and filter out empty lines
        const codes = backupCodesText
          .split("\n")
          .map((code) => code.trim())
          .filter((code) => code.length > 0)
  
        if (codes.length === 0) {
          alert("Please enter at least one valid backup code")
          return
        }
  
        try {
          const submitBtn = addCodesForm.querySelector('button[type="submit"]')
          submitBtn.disabled = true
          submitBtn.textContent = "Adding..."
  
          const response = await fetch("/api/availity/backup-codes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ codes }),
          })
  
          if (response.ok) {
            const data = await response.json()
            alert(`Successfully added ${data.count} new backup codes`)
  
            // Clear the form
            backupCodesTextarea.value = ""
  
            // Reload the page to show the new codes
            window.location.reload()
          } else {
            const data = await response.json()
            alert(`Error: ${data.message}`)
          }
        } catch (error) {
          console.error("Error adding backup codes:", error)
          alert(`Error: ${error.message}`)
        } finally {
          const submitBtn = addCodesForm.querySelector('button[type="submit"]')
          submitBtn.disabled = false
          submitBtn.textContent = "Add Codes"
        }
      })
    }
  })
  
  