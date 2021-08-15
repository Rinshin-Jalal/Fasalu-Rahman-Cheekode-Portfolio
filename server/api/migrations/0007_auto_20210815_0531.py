# Generated by Django 3.2.5 on 2021-08-15 05:31

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_contactform'),
    ]

    operations = [
        migrations.CreateModel(
            name='Emailer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=1000, null=True)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None)),
            ],
        ),
        migrations.AlterField(
            model_name='contactform',
            name='message',
            field=models.CharField(blank=True, max_length=10000, null=True),
        ),
    ]
