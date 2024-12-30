import Filter from './Filter.vue'

export function BpmFilter() {
  return vine`<Filter btnCaption="Bpm" popoverTitle="Bpm">
    <div class="flex gap-4">
      <input class="base-input py-1 px-2 w-24" type="text" name="" id="" placeholder="from" />
      <input class="base-input py-1 px-2 w-24" type="text" name="" id="" placeholder="to" />
    </div>
  </Filter>`
}

export function GenreFilter() {
  const genres = ['Trap', 'R&B', 'Drill', 'Rage', 'Boom bap']

  return vine`<Filter btnCaption="Genre" popoverTitle="Genre">
      <div class="flex flex-col max-h-[150px] overflow-y-scroll">
        <div v-for="genre of genres" :key="genre" class="base-checkbox">
          <input type="checkbox" :name="genre" :id="genre" />
          <label :for="genre" class="p-2 text-nowrap">{{ genre }}</label>
        </div>
      </div>
    </Filter>`
}

export function KeyFilter() {
  const keys = [
    'A Minor',
    'A# Minor',
    'B Minor',
    'C Minor',
    'C# Minor',
    'D Minor',
    'D# Minor',
    'E Minor',
    'F Minor',
    'F# Minor',
    'G Minor',
    'G# Minor',
    'A Major',
    'A# Major',
    'B Major',
    'C Major',
    'C# Major',
    'D Major',
    'D# Major',
    'E Major',
    'F Major',
    'F# Major',
    'G Major',
    'G# Major',
  ]

  return vine`<Filter btnCaption="Key" popoverTitle="Key">
        <div class="flex flex-col max-h-[150px] overflow-y-scroll">
        <div v-for="key of keys" :key="key" class="base-checkbox">
            <input type="checkbox" :name="key" :id="key" />
            <label :for="key" class="p-2 text-nowrap">{{ key }}</label>
        </div>
        </div>
    </Filter>`
}
export function PopularityFilter() {
  return vine`  <Filter btnCaption="Popularity" popoverTitle="Views">
    <div class="flex gap-4">
      <input class="base-input py-1 px-2 w-24" type="text" name="" id="" placeholder="from" />
      <input class="base-input py-1 px-2 w-24" type="text" name="" id="" placeholder="to" />
    </div>
  </Filter>`
}
