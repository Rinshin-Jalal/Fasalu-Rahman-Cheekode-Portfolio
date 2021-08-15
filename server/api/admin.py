from django.contrib import admin
from api.models import Post,Comment,WImage,Gallery,AwardGallery,ContactForm,Email


admin.site.register(Post)
admin.site.register(AwardGallery)
admin.site.register(WImage)
admin.site.register(Gallery)
admin.site.register(ContactForm)
admin.site.register(Email)


# from image_cropping import ImageCroppingMixin

# class PostAdmin(ImageCroppingMixin, admin.ModelAdmin):
#     pass

# admin.site.register(Post, PostAdmin)