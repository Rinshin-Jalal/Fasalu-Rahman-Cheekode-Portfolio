from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import pre_save, post_save
from django.core.mail import send_mail
from io import BytesIO
from PIL import Image
from django.core.files import File
import string 
import random 
from phonenumber_field.modelfields import PhoneNumberField



def compress(image):
    im = Image.open(image).convert('RGB')
    im_io = BytesIO() 
    im.save(im_io, 'JPEG', quality=70) 
    new_image = File(im_io, name=image.name)
    return new_image

def random_string_generator(size = 10, chars = string.ascii_lowercase + string.digits): 
    return ''.join(random.choice(chars) for _ in range(size)) 
  
def unique_slug_generator(instance, new_slug = None): 
    slug =""
    if new_slug is not None: 
        slug = new_slug 
    else: 
        slug = slugify(instance.title+"_"+random_string_generator(size=12)) 
    Klass = instance.__class__ 
    qs_exists = Klass.objects.filter(slug = slug).exists() 
    if qs_exists: 
        new_slug = "{slug}-{randstr}".format( 
            slug = slug, randstr = random_string_generator(size = 4)) 
        return unique_slug_generator(instance, new_slug = new_slug) 
    return slug 





class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=1000, blank=False, default='')
    body = models.TextField(blank=False,null=False, default='')
    slug = models.SlugField(null=True, blank=True,max_length=1500)
    image = models.ImageField(blank=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notify_users = models.BooleanField(default=True)
    notify_users_timestamp = models.DateTimeField(
        blank=True, null=True, auto_now_add=False)
    owner = models.ForeignKey(
        'auth.User', related_name='posts', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['created']

    def save(self,*args,**kwargs):
        super().save(*args,**kwargs)
        if self.notify_users:
            if Email.objects.exists():
                for email in Email.objects.all():
                    subject = f'Important Blog : {self.title} by Fasal Cheekode'
                    body = self.body[slice(50)]
                    message = f'Hi {email.name},\nHere is The shorten Content of the Alert Blog:\n{body}.....\n\n Checkout This Blog:http://localhost:3000/posts/{self.slug} \n\nBy Fasal Cheekode Creative Corner'
                    send_mail(
                        subject,
                        message,
                        'rinzcodemail@gmail.com',
                        [email.email],
                        fail_silently=False,
                    )
                    self.notify_users = False
                    self.notify_users_timestamp = timezone.now()
                    self.save()
            super().save(*args, **kwargs)

class WImage(models.Model):
    image = models.ImageField(blank=False,upload_to="postimages/")
    name = models.CharField(max_length=123,null=True,blank=True)
    def __str__(self):
        return self.name
    def save(self,*args,**kwargs):
        newimage = compress(self.image)
        self.image = newimage
        super().save(*args, **kwargs)

class ContactForm(models.Model):
    name = models.CharField(max_length=123,null=True,blank=True)
    no = models.CharField(max_length=123,null=True,blank=True)
    message = models.CharField(max_length=10000,null=True,blank=True)
    def __str__(self):
        return self.name + "|" + self.no
    def save(self,*args,**kwargs):
        subject = f"Message from {self.name}."
        body = f"Message from {self.name}\nGiven Phone Number: {self.no}\n{self.message}"
        send_mail(
            subject,
            body,
            'rinzcodemail@gmail.com',
            ['rinzhinjalal@gmail.com'],
            fail_silently=False,
        )
        super().save(*args, **kwargs)



class Email(models.Model):
    name = models.CharField(max_length=1000,null=True,blank=False)
    email = models.EmailField(max_length = 254,null=False,blank=False)
    phone_number = PhoneNumberField(blank=True)

    def __str__(self):
        return str(self.name+" : "+self.email)


class Gallery(models.Model):
    desc = models.CharField(max_length=1000)
    image_1 = models.ImageField(blank=False,null=False)
    image_2 = models.ImageField(blank=True,null=True)
    image_3 = models.ImageField(blank=True,null=True)
    image_4 = models.ImageField(blank=True,null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.desc}'
    def save(self, *args, **kwargs):
        new_image_1 = compress(self.image_1)
        self.image_1 = new_image_1
        if self.image_2:
            new_image_2 = compress(self.image_2)
            self.image_2 = new_image_2
        if self.image_3:
            new_image_3 = compress(self.image_3)
            self.image_3 = new_image_3
        if self.image_2:
            new_image_4 = compress(self.image_4)
            self.image_4 = new_image_4
        super().save(*args, **kwargs)



class AwardGallery(models.Model):
    award_name = models.CharField(max_length=1000)
    image = models.ImageField(blank=False,null=False)
    date = models.DateField(blank=False,null=False)

    def __str__(self):
        return f'{self.award_name} got on {str(self.date)}'
    def save(self, *args, **kwargs):
        new_image = compress(self.image)
        super().save(*args, **kwargs)



@receiver(pre_save, sender=Post)
def post_pre_save(sender, instance, *args, **kwargs):
    if not instance.slug: 
       instance.slug = unique_slug_generator(instance)
