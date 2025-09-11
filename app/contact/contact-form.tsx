"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [selectedService, setSelectedService] = useState("consultancy")
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          organization: data.organization || '',
          service: selectedService,
          message: data.message,
        }),
      })
      
      let result;
      
      try {
        // Safely parse JSON response
        result = await response.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        result = { error: "Invalid server response" };
      }
      
      // Log complete info regardless of success/failure
      console.log("Form submission complete:", { 
        ok: response.ok,
        status: response.status, 
        statusText: response.statusText,
        result 
      });
      
      if (!response.ok) {
        // Handle error case - use safe access for error message
        const errorMessage = result && result.error ? result.error : 'Failed to submit form';
        throw new Error(errorMessage);
      }
      
      // Success
      setFormSuccess(true); 
      toast.success("Thank you for your message. We'll get back to you soon!");
      reset(); // Clear the form
      setSelectedService("consultancy"); // Reset service selection
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
      
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleServiceChange = (value) => {
    setSelectedService(value)
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md dark:bg-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Send Us a Message</h2>
      
      {formSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
          <h3 className="font-medium">Message sent successfully!</h3>
          <p>Thank you for contacting us. We'll respond shortly.</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input 
              id="firstName" 
              placeholder="Enter your first name" 
              {...register("firstName", { required: "First name is required" })}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input 
              id="lastName" 
              placeholder="Enter your last name" 
              {...register("lastName", { required: "Last name is required" })}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="Enter your phone number" 
            {...register("phone")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input 
            id="organization" 
            placeholder="Enter your organization name" 
            {...register("organization")}
          />
        </div>

        <div className="space-y-3">
          <Label>What services are you interested in?</Label>
          <RadioGroup 
            value={selectedService} 
            onValueChange={handleServiceChange} 
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consultancy" id="consultancy" />
              <Label htmlFor="consultancy">IT Consultancy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="managed-services" id="managed-services" />
              <Label htmlFor="managed-services">Managed IT Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="training" id="training" />
              <Label htmlFor="training">Staff Training & Support</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All Services</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Tell us about your needs and how we can help"
            className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <>
              Send Message
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
} 