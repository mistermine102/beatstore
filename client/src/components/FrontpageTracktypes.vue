<template>
  <div class="mt-32">
    <h2 class="text-[40px] mb-8">Find what you need</h2>
    <div class="grid grid-cols-12 gap-4 text-2xl">
      <!-- Beats button -->
      <div class="col-span-6 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 relative rounded-regular">
        <div class="relative h-64 flex items-center justify-center">
          <!-- Dark gradient background from black to dark grey -->
          <div class="absolute inset-0 bg-gradient-to-b from-black to-darkGrey transition-colors duration-300"></div>
          
          <!-- Pixel art squares -->
          <div class="absolute top-0 left-0 w-6 h-6 bg-purple-500/70 z-20"></div>
          <div class="absolute top-12 right-8 w-4 h-4 bg-purple-600/60 z-20"></div>
          <div class="absolute bottom-8 left-24 w-8 h-8 bg-purple-400/50 z-20"></div>
          <div class="absolute bottom-16 right-20 w-5 h-5 bg-purple-300/80 z-20"></div>
          <div class="absolute top-24 left-40 w-3 h-3 bg-purple-700/90 z-20"></div>
          
          <!-- TRUE PIXEL ART Rhythm/Beat Pattern Icon -->
          <div class="relative z-25 w-32 h-32">
            <!-- Pattern Grid Background -->
            <div class="absolute top-0 left-0 w-32 h-32 bg-gray-900"></div>
            
            <!-- Beat Pattern - Kick -->
            <div class="absolute top-4 left-4 w-4 h-4 bg-purple-700"></div>
            <div class="absolute top-4 left-20 w-4 h-4 bg-purple-700"></div>
            
            <!-- Beat Pattern - Snare -->
            <div class="absolute top-12 left-12 w-4 h-4 bg-purple-500"></div>
            <div class="absolute top-12 left-28 w-4 h-4 bg-purple-500"></div>
            
            <!-- Beat Pattern - Hi-hat -->
            <div class="absolute top-20 left-4 w-4 h-4 bg-purple-300"></div>
            <div class="absolute top-20 left-12 w-4 h-4 bg-purple-300"></div>
            <div class="absolute top-20 left-20 w-4 h-4 bg-purple-300"></div>
            <div class="absolute top-20 left-28 w-4 h-4 bg-purple-300"></div>
            
            <!-- Grid Lines Vertical -->
            <div class="absolute top-0 left-8 w-1 h-32 bg-gray-800"></div>
            <div class="absolute top-0 left-16 w-1 h-32 bg-gray-800"></div>
            <div class="absolute top-0 left-24 w-1 h-32 bg-gray-800"></div>
            
            <!-- Grid Lines Horizontal -->
            <div class="absolute top-8 left-0 w-32 h-1 bg-gray-800"></div>
            <div class="absolute top-16 left-0 w-32 h-1 bg-gray-800"></div>
            <div class="absolute top-24 left-0 w-32 h-1 bg-gray-800"></div>
            
            <!-- Playhead -->
            <div class="absolute top-28 left-0 w-32 h-4 bg-purple-600"></div>
            <div class="absolute top-28 left-10 w-4 h-4 bg-purple-400"></div>
          </div>
          
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-30"></div>
          <div class="absolute bottom-0 left-0 p-6 z-40 w-full">
            <h3 class="text-3xl font-bold mb-2">Beats</h3>
            <p class="text-base text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Premium beats for your next project</p>
          </div>
        </div>
      </div>
      
      <!-- Samples button -->
      <div class="col-span-6 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 relative rounded-regular">
        <div class="relative h-64 flex items-center justify-center">
          <!-- Dark gradient background from black to dark grey -->
          <div class="absolute inset-0 bg-gradient-to-b from-black to-darkGrey transition-colors duration-300"></div>
          
          <!-- Pixel art squares -->
          <div class="absolute top-5 left-6 w-7 h-7 bg-blue-500/70 z-20"></div>
          <div class="absolute top-20 right-12 w-5 h-5 bg-blue-600/60 z-20"></div>
          <div class="absolute bottom-12 left-32 w-6 h-6 bg-blue-400/50 z-20"></div>
          <div class="absolute bottom-24 right-40 w-4 h-4 bg-blue-300/80 z-20"></div>
          <div class="absolute top-32 left-20 w-8 h-8 bg-blue-700/90 z-20"></div>
          
          <!-- TRUE PIXEL ART Vinyl Record Icon -->
          <div class="relative z-25 w-32 h-32">
            <!-- Record body -->
            <div class="absolute top-4 left-4 w-24 h-24 bg-gray-900"></div>
            
            <!-- Outer ring structure - pixel by pixel -->
            <div class="absolute top-4 left-8 w-16 h-4 bg-blue-900"></div>
            <div class="absolute top-8 left-4 w-4 h-16 bg-blue-900"></div>
            <div class="absolute top-24 left-8 w-16 h-4 bg-blue-900"></div>
            <div class="absolute top-8 left-24 w-4 h-16 bg-blue-900"></div>
            
            <!-- Inner ring -->
            <div class="absolute top-12 left-12 w-8 h-8 bg-blue-700"></div>
            
            <!-- Center hole -->
            <div class="absolute top-14 left-14 w-4 h-4 bg-gray-800"></div>
            
            <!-- Grooves - Stylized as pixel rings -->
            <div class="absolute top-8 left-8 w-16 h-16 bg-blue-800"></div>
            <div class="absolute top-10 left-10 w-12 h-12 bg-blue-700"></div>
            <div class="absolute top-16 left-10 w-12 h-2 bg-blue-500"></div>
            <div class="absolute top-20 left-10 w-12 h-2 bg-blue-500"></div>
            
            <!-- Sample point markers -->
            <div class="absolute top-9 left-16 w-2 h-2 bg-blue-400"></div>
            <div class="absolute top-19 left-14 w-2 h-2 bg-blue-400"></div>
            <div class="absolute top-13 left-22 w-2 h-2 bg-blue-400"></div>
          </div>
          
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-30"></div>
          <div class="absolute bottom-0 left-0 p-6 z-40 w-full">
            <h3 class="text-3xl font-bold mb-2">Samples</h3>
            <p class="text-base text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">High-quality audio samples for any genre</p>
          </div>
        </div>
      </div>
      
      <!-- Loops button (full width) -->
      <div class="col-span-12 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 relative rounded-regular">
        <div class="relative h-64 flex items-center justify-center">
          <!-- Dark gradient background from black to dark grey -->
          <div class="absolute inset-0 bg-gradient-to-b from-black to-darkGrey transition-colors duration-300"></div>
          
          <!-- Pixel art squares -->
          <div class="absolute top-8 left-12 w-6 h-6 bg-green-500/70 z-20"></div>
          <div class="absolute top-24 right-24 w-8 h-8 bg-green-600/60 z-20"></div>
          <div class="absolute bottom-16 left-48 w-5 h-5 bg-green-400/50 z-20"></div>
          <div class="absolute bottom-8 right-64 w-7 h-7 bg-green-300/80 z-20"></div>
          <div class="absolute top-16 left-96 w-6 h-6 bg-green-700/90 z-20"></div>
          <div class="absolute top-32 right-36 w-4 h-4 bg-green-600/70 z-20"></div>
          <div class="absolute bottom-24 left-72 w-9 h-9 bg-green-500/60 z-20"></div>
          <div class="absolute bottom-12 right-80 w-5 h-5 bg-green-400/90 z-20"></div>
          
          <!-- Pixel Art Loop Icon (unchanged) -->
          <div class="relative z-25 h-40 w-40 flex items-center justify-center">
            <!-- Circular arrow path -->
            <div class="absolute top-0 left-8 w-8 h-8 bg-green-500 rounded-sm"></div>
            <div class="absolute top-0 right-8 w-8 h-8 bg-green-500 rounded-sm"></div>
            <div class="absolute top-8 left-0 w-8 h-8 bg-green-500 rounded-sm"></div>
            <div class="absolute top-8 right-0 w-8 h-8 bg-green-500 rounded-sm"></div>
            
            <div class="absolute bottom-0 left-8 w-8 h-8 bg-green-500 rounded-sm"></div>
            <div class="absolute bottom-0 right-8 w-8 h-8 bg-green-500 rounded-sm"></div>
            <div class="absolute bottom-8 left-0 w-8 h-8 bg-green-500 rounded-sm"></div>
            <div class="absolute bottom-8 right-0 w-8 h-8 bg-green-500 rounded-sm"></div>
            
            <!-- Arrow points -->
            <div class="absolute top-0 left-16 w-8 h-8 border-t-8 border-r-8 border-green-500 transform rotate-45"></div>
            <div class="absolute bottom-0 right-16 w-8 h-8 border-b-8 border-l-8 border-green-500 transform rotate-45"></div>
            
            <!-- Inner circle -->
            <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <div class="w-8 h-8 bg-green-400 rounded-full"></div>
            </div>
          </div>
          
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-30"></div>
          <div class="absolute bottom-0 left-0 p-6 z-40 w-full">
            <h3 class="text-3xl font-bold mb-2">Loops</h3>
            <p class="text-base text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Endless creativity with our loops</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>