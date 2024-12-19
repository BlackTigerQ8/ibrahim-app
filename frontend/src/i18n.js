import i18n, { changeLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          pages: "Pages",
          home: "Home",
          schedules: "Schedules",
          SCHEDULES: "SCHEDULES",
          trainingCategories: "Training Categories",
          aboutMe: "About Me",
          dashboard: "Dashboard",
          DHASBOARD: "DASHBOARD",
          dashboardSubtitle: "Welcome to your dashboard",
          TEAM: "TEAM",
          NOTIFICATIONS: "NOTIFICATIONS",
          notificationTitle: "Important Notifications Page",
          userProfileTitle: "USER PROFILE",
          notifications: "Notifications",
          settings: "Settings",
          forms: "Forms",
          profile: "Profile",
          contact: "Contact",
          calendar: "Calendar",
          userForm: "User Form",
          messages: "Messages",
          message: "Message",
          send: "Send",
          data: "Data",
          role: "Role",
          Admin: "Admin",
          Family: "Family",
          Coach: "Coach",
          Athlete: "Athlete",
          login: "LOGIN",
          loginRequred: "You need to login",
          notAuthorized: "You are not authorized to visit this page",
          logout: "Logout",
          areYouSureLogout: "Are you sure you want to log out?",
          loggedOut: "you logged out successfully",
          cancel: "Cancel",
          confirm: "Confirm",
          loggingIn: "Logging in...",
          loginUserFulfilled: "You are in :)",
          loginUserRejected: "Failed to login!",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
          createNewUser: "Create New User",
          phone: "Phone Number",
          name: "Name",
          civilId: "Civil ID",
          accessLevel: "Access Level",
          actions: "Actions",
          required: "required",
          firstName: "First Name",
          lastName: "Last Name",
          optionalEmail: "Email (optional)",
          idNumber: "ID Number",
          uploadFile: "Upload File",
          uploadImage: "Upload Image",
          viewUploadedFile: "View Uploaded File",
          update: "Update",
          saveChanges: "Save Changes",
          delete: "Delete",
          add: "Add",
          edit: "Edit",
          leaveBlankPassword: "Leave blank to keep the current password",
          firstNameIsRequired: "First name is required",
          lastNameIsRequired: "Last name is required",
          invalidEmail: "Invalid email",
          emailIsRequired: "Email is required",
          invalidPhoneNumber: "Invalid Phone Number",
          phoneIsRequired: "Phone number is required",
          roleIsRequired: "Role selection is required",
          passwordMinLength: "Password minimum length is 6 characters",
          passwordIsRequired: "Password is requitred",
          passwordMustMatch: "Passwords must match",
          confirmPasswordIsRequired: "Confirm password is required",
          search: "Search",
          notes: "NOTES",
          kd: "KD",
          from: "From",
          /////////////
          userDeletedSuccessfully: "User is successfully deleted!",
          userDeletedFailed: "Can't delete a user, you can try later!",
          userInformationUpdated: "User Information is updated successfully.",
          userInformationUdateFailed: "Something went wrong! Please try later.",
          /////////////
          changeLanguage: "Change Language",
          darkMode: "Dark Mode",
          lightMode: "Light Mode",
          noMessages: "No messages available",
          /////////////
          sendMessageFulfilled: "Message is successfully sent!",
          sendMessageRejected: "Can't send a message, you can try later!",
          updateUserRejected: "Something went wrong! Please try later.",
          updateUserFulfilled: "User Information is updated successfully.",
          deleteUserRejected: "Can't delete a user, you can try later!",
          deleteUserFulfilled: "User is successfully deleted!",
          /////////////
          registerUserFulfilled: "User is added successfully!",
          registerUserRejected: "Something went wrong! Please try later!",
          profileImageFulfilled: "User profile image is uploaded successfully!",
          profileImageRejected: "Something went wrong! Please try later!",
          profileImage: "Profile Image",
          /////////////
          newMessageHeading: "New Message Alert",
          newMessageMessage:
            "{{senderName}} has sent you a message on {{date}}",
          /////////////
          categories: "Categories",
          CATEGORIES: "CATEGORIES",
          categoriesFormTitle: "CATEGORIES FORM",
          categoriesFormSubtitle: "Create a new training category",
          categoryForm: "Category Form",
          backToCategories: "Back to Categories",
          categoryImage: "Category Image",
          description: "Description",
          createNewCategory: "Create New Category",
          onlyImageAllowed: "Only Image Allowed",
          onlyImagesAllowed: "Only Images Allowed",
          nameIsRequired: "Name is Required",
          descriptionIsRequired: "Description is Required",
          createCategoryError: "Failed to create category",
          createCategorySuccess: "Category created successfully",
          updateCategoryError: "Failed to update category",
          updateCategorySuccess: "Category updated successfully",
          deleteCategoryError: "Failed to delete category",
          deleteCategorySuccess: "Category deleted successfully",
          userProfileSubtitle: "Update your profile information",
          userProfileImageError: "Failed to update profile image",
          userProfileImageSuccess: "Profile image updated successfully",
          userProfileImageRejected: "Something went wrong! Please try later!",
          userProfileImageFulfilled: "Profile image uploaded successfully",
          createdAt: "Created At",
          /////////////
          TRAININGS: "Trainings",
          availableTrainings: "Available Trainings",
          createNewTraining: "Create New Training",
          noTrainingsAvailable: "No trainings available",
          errorLoadingTrainings:
            "Error loading trainings. Please try again later.",
          backToTrainings: "Back to Trainings",
          trainingDetails: "Training Details",
          mediaPlaceholder: "Media Placeholder",
          numberOfSets: "Number of Sets",
          numberOfRepeats: "Number of Repeats",
          restBetweenSets: "Rest Between Sets",
          restBetweenRepeats: "Rest Between Repeats",
          second: "Second",
          seconds: "Seconds",
          minute: "Minute",
          minutes: "Minutes",
          hour: "Hour",
          hours: "Hours",
          day: "Day",
          days: "Days",
          week: "Week",
          weeks: "Weeks",
          month: "Month",
          months: "Months",
          year: "Year",
          years: "Years",
          /////////////
          users: "Users",
          USERS: "USERS",
          usersFormTitle: "USERS FORM",
          usersFormSubtitle: "Create a new user",
          manageUsers: "Manage Users",

          /////////////
          Abdullah: "Abdullah",
          Khaled: "Khaled",
          Wahab: "Wahab",
          Hilayl: "Hilayl",
          Ibrahim: "Ibrahim",
          Mohammed: "Mohammed",
          Sultan: "Sultan",
          Yousif: "Yousif",
          Abdulaziz: "Abdulaziz",
          Aziz: "Aziz",
          Omar: "Omar",
          Falih: "Falih",
          Alenezi: "Alenezi",
          Aldhufeeri: "Aldhuferi",
          Almutairi: "Almutairi",
          Alharbi: "Alharbi",
          Kanbar: "Kanbar",
        },
      },
      ar: {
        translation: {
          welcome: "مرحبًا",
          pages: "الصفحات",
          home: "الرئيسية",
          schedules: "الجدول",
          SCHEDULES: "الجدول",
          trainingCategories: "أقسام التمارين",
          aboutMe: "نبذة",
          dashboard: "لوحة التحكم",
          DHASBOARD: "لوحة التحكم",
          dashboardSubtitle: "مرحبًا بك في لوحة التحكم الخاصة بك",
          TEAM: "الفريق",
          NOTIFICATIONS: "الإشعارات",
          notificationTitle: "صفحة الإشعارات الهامة",
          userProfileTitle: "الملف الشخصي للمستخدم",
          notifications: "الإشعارات",
          settings: "الإعدادات",
          forms: "النماذج",
          profile: "الملف الشخصي",
          contact: "التواصل",
          calendar: "التقويم",
          userForm: "نموذج المستخدم",
          messages: "الرسائل",
          message: "رسالة",
          send: "إرسال",
          data: "البيانات",
          role: "الدور",
          Admin: "مسؤول",
          Family: "العائلة",
          Coach: "مدرب",
          Athlete: "لاعب",
          login: "تسجيل الدخول",
          loginRequred: "تحتاج إلى تسجيل الدخول",
          notAuthorized: "غير مسموح لك بزيارة هذه الصفحة",
          logout: "تسجيل الخروج",
          areYouSureLogout: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
          loggedOut: "تم تسجيل الخروج بنجاح",
          cancel: "إلغاء",
          confirm: "تأكيد",
          loggingIn: "جاري تسجيل الدخول...",
          loginUserFulfilled: "حياك الله... :)",
          loginUserRejected: "فشل في تسجيل الدخول",
          email: "البريد الإلكتروني",
          password: "كلمة المرور",
          confirmPassword: "تأكيد كلمة المرور",
          createNewUser: "إنشاء مستخدم جديد",
          phone: "رقم الهاتف",
          name: "الاسم",
          civilId: "الرقم المدني",
          accessLevel: "مستوى الوصول",
          actions: "الإجراءات",
          required: "مطلوب",
          firstName: "الاسم الأول",
          lastName: "الاسم الأخير",
          optionalEmail: "البريد الإلكتروني (اختياري)",
          idNumber: "رقم الهوية",
          uploadFile: "رفع ملف",
          uploadImage: "ارفع صورة",
          viewUploadedFile: "عرض الملف المرفوع",
          update: "تحديث",
          saveChanges: "احفظ التعديلات",
          delete: "حذف",
          add: "إضافة",
          edit: "تعديل",
          leaveBlankPassword: "اترك الحقل فارغًا للاحتفاظ بكلمة المرور الحالية",
          firstNameIsRequired: "الاسم الأول مطلوب",
          lastNameIsRequired: "الاسم الأخير مطلوب",
          invalidEmail: "البريد الإلكتروني غير صالح",
          emailIsRequired: "البريد الإلكتروني مطلوب",
          invalidPhoneNumber: "رقم الهاتف غير صالح",
          phoneIsRequired: "رقم الهاتف مطلوب",
          roleIsRequired: "تحديد الدور مطلوب",
          passwordMinLength: "الحد الأدنى لطول كلمة المرور هو 6 أحرف",
          passwordIsRequired: "كلمة المرور مطلوبة",
          passwordMustMatch: "يجب أن تتطابق كلمتا المرور",
          confirmPasswordIsRequired: "تأكيد كلمة المرور مطلوب",
          search: "بحث",
          notes: "الملاحظات",
          kd: "دينار",
          from: "من",
          /////////////
          userDeletedSuccessfully: "تم حذف المستخدم بنجاح!",
          userDeletedFailed: "لا يمكن حذف المستخدم، يمكنك المحاولة لاحقًا!",
          userInformationUpdated: "تم تحديث معلومات المستخدم بنجاح.",
          userInformationUdateFailed: "حدث خطأ ما! يرجى المحاولة لاحقًا.",
          /////////////
          changeLanguage: "تغيير اللغة",
          darkMode: "الوضع الداكن",
          lightMode: "الوضع الفاتح",
          noMessages: "لا توجد رسائل",
          /////////////
          sendMessageFulfilled: "تم إرسال الرسالة بنجاح!",
          sendMessageRejected: "لا يمكن إرسال الرسالة، يمكنك المحاولة لاحقًا!",
          updateUserRejected: "حدث خطأ ما! يرجى المحاولة لاحقًا.",
          updateUserFulfilled: "تم تحديث معلومات المستخدم بنجاح.",
          deleteUserRejected: "لا يمكن حذف المستخدم، يمكنك المحاولة لاحقًا!",
          deleteUserFulfilled: "تم حذف المستخدم بنجاح!",
          /////////////
          registerUserFulfilled: "تم إضافة المستخدم بنجاح!",
          registerUserRejected: "حدث خطأ ما! يرجى المحاولة لاحقًا!",
          profileImageFulfilled: "تم رفع صورة الملف الشخصي بنجاح!",
          profileImageRejected: "حدث خطأ ما! يرجى المحاولة لاحقًا!",
          profileImage: "صورة الملف الشخصي",
          /////////////
          newMessageHeading: "تنبيه برسالة جديدة",
          newMessageMessage: "{{senderName}} أرسل لك رسالة في {{date}}",
          /////////////
          CATEGORIES: "الأقسام",
          categories: "الأقسام",
          categoriesFormTitle: "نموذج الأقسام",
          categoriesFormSubtitle: "إنشاء قسم تمرين جديد",
          categoryForm: "نموذج أقسام التمرين",
          backToCategories: "العودة للأقسام",
          categoryImage: "صورة القسم",
          description: "الوصف",
          createNewCategory: "إنشاء قسم جديد",
          onlyImageAllowed: "مسموح فقط بالصور",
          onlyImagesAllowed: "مسموح فقط بالصور",
          nameIsRequired: "الاسم مطلوب",
          descriptionIsRequired: "الوصف مطلوب",
          createCategoryError: "فشل إنشاء القسم",
          createCategorySuccess: "تم إنشاء القسم بنجاح",
          updateCategoryError: "فشل تحديث القسم",
          updateCategorySuccess: "تم تحديث القسم بنجاح",
          deleteCategoryError: "فشل حذف القسم",
          deleteCategorySuccess: "تم حذف القسم بنجاح",
          userProfileSubtitle: "تحديث معلومات الملف الشخصي",
          userProfileImageError: "فشل تحديث صورة الملف الشخصي",
          userProfileImageSuccess: "تم تحديث صورة الملف الشخصي بنجاح",
          userProfileImageRejected: "حدث خطأ ما! يرجى المحاولة لاحقًا!",
          userProfileImageFulfilled: "تم رفع صورة الملف الشخصي بنجاح",
          createdAt: "تاريخ الإنشاء",
          /////////////
          TRAININGS: "التدريبات",
          availableTrainings: "التدريبات المتاحة",
          createNewTraining: "إنشاء تدريب جديد",
          noTrainingsAvailable: "لا توجد تدريبات متاحة",
          errorLoadingTrainings:
            "حدث خطأ في تحميل التدريبات. يرجى المحاولة لاحقاً.",
          backToTrainings: "العودة للتدريبات",
          trainingDetails: "تفاصيل التدريب",
          mediaPlaceholder: "مكان  الصورة/الفيديو",
          numberOfSets: "عدد المجموعات",
          numberOfRepeats: "عدد التكرارات",
          restBetweenSets: "راحة بين المجموعات",
          restBetweenRepeats: "راحة بين التكرارات",
          second: "ثانية",
          seconds: "ثواني",
          minute: "دقيقة",
          minutes: "دقائق",
          hour: "ساعة",
          hours: "ساعات",
          day: "يوم",
          days: "أيام",
          week: "أسبوع",
          weeks: "أسابيع",
          month: "شهر",
          months: "أشهر",
          year: "سنة",
          years: "سنوات",
          /////////////
          users: "المستخدمين",
          USERS: "المستخدمين",
          usersFormTitle: "نموذج المستخدمين",
          usersFormSubtitle: "إنشاء مستخدم جديد",
          manageUsers: "إدارة المستخدمين",
          /////////////
          Abdullah: "عبدالله",
          Khaled: "خالد",
          Wahab: "وهاب",
          Hilayl: "هليل",
          Ibrahim: "ابراهيم",
          Mohammed: "محمد",
          Sultan: "سلطان",
          Yousif: "يوسف",
          Abdulaziz: "عبدالعزيز",
          Aziz: "عزيز",
          Omar: "عمر",
          Falih: "فالح",
          Alenezi: "العنزي",
          Aldhufeeri: "الظفيري",
          Almutairi: "المطيري",
          Alharbi: "الحربي",
          Kanbar: "قنبر",
        },
      },
    },
  });

export default i18n;
