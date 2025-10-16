# How to Sign In as an Administrator

This document provides step-by-step instructions for logging into the Myflix application with administrative privileges.

## Admin Credentials

To access the admin dashboard, use the following pre-configured credentials which are defined in the mock user data:

-   **Email:** `admin@myflix.com`
-   **Password:** `password`

---

## Sign-In Steps

1.  **Launch the Application**: Open the `index.html` file in your web browser.

2.  **Navigate to the Sign-In Page**:
    *   Click on the **"Sign In"** button located in the top-right corner of the header.
    *   Alternatively, you can directly navigate to the login page by adding `#/login` to the end of the URL.

3.  **Enter Credentials**:
    *   On the Sign In form, enter the admin credentials:
    *   In the **Email** field, enter `admin@myflix.com`.
    *   In the **Password** field, enter `password`.

4.  **Submit the Form**:
    *   Click the bright red **"Sign In"** button to submit your credentials.

## Expected Result

Upon successful authentication, the application will automatically redirect you to the **Admin Dashboard**. From this dashboard, you can manage the site's movie content, view statistics, and perform other administrative tasks.

If you are not redirected, please double-check that you have entered the email and password correctly and that the `data/users.ts` file contains the admin user as specified above.