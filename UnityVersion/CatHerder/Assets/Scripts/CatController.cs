using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class CatController : MonoBehaviour
{

    public float speed;
    public float stageSize;
    public int changeDirectionInterval;
    public int increaseSpeedInterval;
    public int collisionDelay;
    public int fleeDuration;
    public int scoreMultiplierValue;
    public float fleeSpeedIncrease;

    public Text ScoreText;
    public Text LoseText;
    public Button TryAgainBtn;
    private Rigidbody2D rb2d;
    private Animator animator;

    private float horizontalDirection;
    private float verticalDirection;
    private int changeHorizontalDirectionCounter;
    private int changeVerticalDirectionCounter;
    private int increaseSpeedCounter;
    private int collisionDelayCounter;
    private bool fleeing;
    private bool escaped;
    private int fleeCounter;
    private int scoreMultiplier;

    private string score;

    void Start()
    {
        rb2d = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
        horizontalDirection = 2;
        verticalDirection = 2;
        changeHorizontalDirectionCounter = 0;
        changeVerticalDirectionCounter = 0;
        collisionDelayCounter = 0;
        fleeing = false;
        escaped = false;
        score = "0";
        scoreMultiplier = scoreMultiplierValue;
        TryAgainBtn.gameObject.SetActive(false);

        UpdateScoreText();
    }

    void FixedUpdate()
    {
        var movement = new Vector2(horizontalDirection, verticalDirection);
        var velocity = movement;

        if(fleeing && fleeCounter <= fleeDuration)
        {
            fleeCounter++;
            velocity = velocity * (speed * fleeSpeedIncrease); 
        }
        else
        {
            fleeing = false;
            velocity = velocity * speed;
            if (!escaped)
            {
                ChangeDirection();
            }
        }

        rb2d.velocity = velocity;

        if (increaseSpeedCounter == increaseSpeedInterval)
        {
            speed = speed + (float)0.1;
            increaseSpeedCounter = 0;
        }

        SetCurrentAnimation();

        increaseSpeedCounter++;
        collisionDelayCounter++;
        if (scoreMultiplier > 1)
        {
            scoreMultiplier--;
        }


        //for phones
        var fingerCount = 0;
        foreach (Touch touch in Input.touches)
        {
            score += "Touch Detected\r\n";
            UpdateScoreText();
            if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled)
            {
                OnTap(touch);
            }

        }
    }

    private void OnMouseDown()
    {
        var mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);

        fleeing = true;
        fleeCounter = 0;
        var midX = rb2d.position.x + 0.3;
        var midY = rb2d.position.y + 0.3;

        horizontalDirection = mousePosition.x > midX ? -1 : 1;
        verticalDirection = mousePosition.y > midY ? -1 : 1;

        ResetDirectionCounters();
    }

    private void OnTap(Touch touch)
    {
        score += "Entering OnTap @ "+touch.position+"\r\n";
        UpdateScoreText();
        var tapPosition = Camera.main.ScreenToWorldPoint(touch.position);
        var tapPosition2d = new Vector2(tapPosition.x, tapPosition.y);
        var hit = Physics2D.Raycast(tapPosition2d, Camera.main.transform.forward);

        if (hit.collider != null)
        {
            score = "collider isnt nullr\n";
            var touchedObject = hit.transform.gameObject;
            score += touchedObject.name;
            score += touchedObject.tag;

            if (hit.collider.tag == "Cat")
            {
                score += "Cat Fleeing!r\n";

                fleeing = true;
                fleeCounter = 0;
                var midX = rb2d.position.x + 0.3;
                var midY = rb2d.position.y + 0.3;

                horizontalDirection = tapPosition.x > midX ? -1 : 1;
                verticalDirection = tapPosition.y > midY ? -1 : 1;

                ResetDirectionCounters();
            }
        }      
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Wall") && collisionDelayCounter > collisionDelay)
        {
            //reverse direction and reset counter
            if (!escaped)
            {
                horizontalDirection = ReverseDirection(horizontalDirection);
                verticalDirection = ReverseDirection(verticalDirection);

                collisionDelayCounter = 0;
                ResetDirectionCounters();
            }
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.gameObject.CompareTag("EscapeTrigger"))
        {
             escaped = true;

            LoseText.text = "Cat Escaped! \r\n You Lose!";
            TryAgainBtn.gameObject.SetActive(true);
            TryAgainBtn.onClick.AddListener(RestartGame); 
        }
        else if (collision.gameObject.CompareTag("Objective"))
        {
            collision.gameObject.transform.position = new Vector2(Random.Range(stageSize * -1, stageSize), Random.Range(stageSize * -1, stageSize));
            score = score + scoreMultiplier;
            scoreMultiplier = scoreMultiplierValue;
            UpdateScoreText();
        }
    }

    private void ChangeDirection()
    {
        if (changeHorizontalDirectionCounter % changeDirectionInterval == 0)
        {
            horizontalDirection = Random.Range(-1, 2);
            changeHorizontalDirectionCounter = Random.Range(0, changeDirectionInterval - 1);
        }

        if (changeVerticalDirectionCounter % changeDirectionInterval == 0)
        {
            verticalDirection = Random.Range(-1, 2);
            changeVerticalDirectionCounter = Random.Range(0, changeDirectionInterval - 1);
        }

        changeHorizontalDirectionCounter++;
        changeVerticalDirectionCounter++;
    }

    private void SetCurrentAnimation()
    {
        //Vertical Only
        if(horizontalDirection == 0)
        {
            //Sit
            if(verticalDirection == 0)
            {

            }
            //Up
            else if(verticalDirection > 0)
            {
                animator.SetInteger("Direction", 2);
            }
            //Down
            else
            {
                animator.SetInteger("Direction", 0);
            }
        }

        //Horizontal Only
        else if (verticalDirection == 0)
        {
            //Sit
            if (horizontalDirection == 0)
            {

            }
            //Right
            else if (horizontalDirection > 0)
            {
                animator.SetInteger("Direction", 3);
            }
            //Left
            else
            {
                animator.SetInteger("Direction", 1);
            }
        }

        //Both, currently favouring up and down animations
        else
        {
            //2 values
            //Right
            if(horizontalDirection == 2 && verticalDirection != 2)
            {
                animator.SetInteger("Direction", 3);
            }
            //Up Note: Favor this if both are 2
            else if(verticalDirection == 2)
            {
                animator.SetInteger("Direction", 2);
            }
            //Up
            else if (verticalDirection == 1)
            {
                animator.SetInteger("Direction", 2);
            }
            //down
            else if (verticalDirection == -1)
            {
                animator.SetInteger("Direction", 0);
            }

            //1 values
            //right
            else if (horizontalDirection == 1)
            {
                animator.SetInteger("Direction", 3);
            }
            //left
            else if (horizontalDirection == -1)
            {
                animator.SetInteger("Direction", 1);
            }


        }
    }

    private float ReverseDirection(float currentDirection)
    {
        return currentDirection * -1;
    }

    private void ResetDirectionCounters()
    {
        changeHorizontalDirectionCounter = 0;
        changeVerticalDirectionCounter = 0;
    }

    private void UpdateScoreText()
    {
        ScoreText.text = "Score: " + score;
    }

    private void RestartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
}
