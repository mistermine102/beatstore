<template>
  <footer class="bg-darkGrey mt-32 md:px-8 xl:px-48 2xl:px-64">
    <div class="mx-auto px-4 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Brand Section -->
        <div class="space-y-4">
          <h3 class="text-2xl font-secondary">WavsMarket</h3>
          <p class="text-textLightGrey">Your one-stop marketplace for high-quality beats, samples, and loops.</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-medium mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-textLightGrey hover:text-primary transition-colors">Home</router-link></li>
            <li><router-link to="/upload" class="text-textLightGrey hover:text-primary transition-colors">Upload</router-link></li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h4 class="font-medium mb-4">Categories</h4>
          <ul class="space-y-2">
            <li><router-link to="/tracks/browse?type=beat" class="text-textLightGrey hover:text-primary transition-colors">Beats</router-link></li>
            <li>
              <router-link to="/tracks/browse?type=sample" class="text-textLightGrey hover:text-primary transition-colors">Samples</router-link>
            </li>
            <li><router-link to="/tracks/browse?type=loop" class="text-textLightGrey hover:text-primary transition-colors">Loops</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/[0.1]">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex space-x-6 mt-4 md:mt-0">
            <router-link to="/privacy-policy" class="text-sm text-textLightGrey hover:text-primary transition-colors">Privacy Policy</router-link>
            <router-link to="/terms" class="text-sm text-textLightGrey hover:text-primary transition-colors">Terms And Conditions</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>
