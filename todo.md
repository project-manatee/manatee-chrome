====TASK====
  * Background page:
      - once every now and then:
          * test if logged in
          * if logged in,
              - get averages
              - get course details
              - put data in local storage
          * otherwise,
              - try to log in with cached (from local storage, so still legal) credentials
    
  * Browser action:
      - test if logged in
      - if logged in,
          * show cached data
          * request new data
          * allow to modify grades
          * allow to click on course to get detailed information
      - otherwise,
          * ask for credentials
          * cache credentials
    
====IMPLEMENTATION====
  * class cache mem:
      - function to see if you is logged in
      - function to get all averages and all course grades
      - function to update all (if logged in)
      - function to input credentials
      - has a student grade set
    
  * class clock:
      - function to run an action every so often

  * class student grade set:
      - function to calculate GPA
	  - function to hypothetically modify grades
	  - function all grades to actual grades
    
  * log-in page:
      - request credentials
      - input credentials to cache, when received
      - request cahce update
    
  * average page:
      - if not logged in, go to log-in page
      - otherwise, show cached information
      - allows you to edit grades (uses student grade set)
    
  * course page:
      - takes an input that tells you which course and which cycle
      - displays grades
      - allows you to edit grades (uses student grade set)
    
  * background page:
      - start a new instance of clock to run a cache mem's update function periodically
