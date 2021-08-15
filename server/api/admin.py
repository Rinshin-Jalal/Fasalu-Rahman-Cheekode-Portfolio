from django.contrib import admin
from api.models import Post,WImage,Gallery,AwardGallery,ContactForm,Email


admin.site.register(Post)
admin.site.register(AwardGallery)
admin.site.register(WImage)
admin.site.register(Gallery)
admin.site.register(ContactForm)
admin.site.register(Email)

