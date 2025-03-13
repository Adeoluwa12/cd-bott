document.addEventListener("DOMContentLoaded", () => {
    // Filter form handling
    const filterForm = document.getElementById("filterForm")
    if (filterForm) {
      filterForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const formData = new FormData(filterForm)
        const params = new URLSearchParams()
  
        for (const [key, value] of formData.entries()) {
          if (value) {
            params.append(key, value)
          }
        }
  
        // Add current page size if it exists in URL
        const currentUrlParams = new URLSearchParams(window.location.search)
        if (currentUrlParams.has("limit")) {
          params.append("limit", currentUrlParams.get("limit"))
        }
  
        // Navigate to filtered URL
        window.location.href = `/referrals?${params.toString()}`
      })
  
      // Reset button
      filterForm.addEventListener("reset", () => {
        // Wait for form to reset
        setTimeout(() => {
          // Keep only the page size parameter if it exists
          const currentUrlParams = new URLSearchParams(window.location.search)
          const params = new URLSearchParams()
  
          if (currentUrlParams.has("limit")) {
            params.append("limit", currentUrlParams.get("limit"))
          }
  
          if (params.toString()) {
            window.location.href = `/referrals?${params.toString()}`
          } else {
            window.location.href = "/referrals"
          }
        }, 0)
      })
    }
  })
  
  