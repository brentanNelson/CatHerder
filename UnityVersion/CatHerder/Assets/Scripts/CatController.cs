using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CatController : MonoBehaviour
{

    public float speed;
    public int changeDirectionInterval;
    public int increaseSpeedInterval;
    public int collisionDelay;
    public float fleeSpeed;

    private Rigidbody2D rb2d;

    private float horizontalDirection;
    private float verticalDirection;
    private int changeHorizontalDirectionCounter;
    private int changeVerticalDirectionCounter;
    private int increaseSpeedCounter;
    private int collisionDelayCounter;

    void Start()
    {
        rb2d = GetComponent<Rigidbody2D>();
        horizontalDirection = 2;
        verticalDirection = 2;
        changeHorizontalDirectionCounter = 0;
        changeVerticalDirectionCounter = 0;
        collisionDelayCounter = 0;
    }

    void FixedUpdate()
    {
        //float moveHorizontal = Input.GetAxis("Horizontal");

        // float moveVertical = Input.GetAxis("Vertical");

        Vector2 movement = new Vector2(horizontalDirection, verticalDirection);
        rb2d.velocity = movement * speed;

        ChangeDirection();

        if (increaseSpeedCounter == increaseSpeedInterval)
        {
            speed = speed + (float)0.1;
            increaseSpeedCounter = 0;
        }
        increaseSpeedCounter++;
        collisionDelayCounter++;
    }

    private void OnMouseDown()
    {
        var mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);

        var clickX = mousePosition.x;
        var clickY = mousePosition.y;
        var midX = rb2d.position.x + 0.3;
        var midY = rb2d.position.y + 0.3;
        var newX = rb2d.position.x;
        var newY = rb2d.position.y;

        //run left
        if (clickX > midX)
        {
            //currently running right
            if (horizontalDirection > 0)
            {
                horizontalDirection = ReverseDirection(horizontalDirection);
            }
            newX = newX - fleeSpeed;
        }

        //run right
        else if(clickX < midX)
        {
            //currently running right
            if (horizontalDirection < 0)
            {
                horizontalDirection = ReverseDirection(horizontalDirection);
            }

            newX = newX + fleeSpeed;
        }

        //run down
        if (clickY > midY)
        {
            //currently running up
            if (verticalDirection > 0)
            {
                verticalDirection = ReverseDirection(verticalDirection);
            }

            newY = newY - fleeSpeed;
        }
        //run up
        else if(clickY < midY)
        {
            //currently running up
            if (verticalDirection < 0)
            {
                verticalDirection = ReverseDirection(verticalDirection);
            }
            newY = newY + fleeSpeed;
        }
        rb2d.MovePosition(new Vector2(newX, newY));

        ResetDirectionCounters();
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Wall") && collisionDelayCounter > collisionDelay)
        {
            //reverse direction and reset counter
            horizontalDirection = ReverseDirection(horizontalDirection);
            verticalDirection = ReverseDirection(verticalDirection);

            collisionDelayCounter = 0;
            ResetDirectionCounters();
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.gameObject.CompareTag("Window"))
        {
            //ADD LOSE CONDITION
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

    private float ReverseDirection(float currentDirection)
    {
        return currentDirection * -1;
    }

    private void ResetDirectionCounters()
    {
        changeHorizontalDirectionCounter = 0;
        changeVerticalDirectionCounter = 0;
    }
}
